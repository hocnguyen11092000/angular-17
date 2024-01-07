import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileItemComponent } from './file-item.component';
import _ from 'lodash';
import { BehaviorSubject, Subject, concatMap, filter, from, tap } from 'rxjs';
import { FileService } from './file.service';
import { CommonModule } from '@angular/common';
import { FileItemSkeleton } from './file-item-skeletone.component';

@Component({
  selector: 'app-upload-file',
  template: `
    <style>
      .upload-file {
        margin: 12px 0;
      }

      .file-container {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .file-item {
        flex-basis: 35%;
      }
    </style>
    <div class="upload-file">
      <button class="mb-3" (click)="handleClickBtnUploadFile(file)">
        Tải tệp lên
      </button>
      <input
        #file
        type="file"
        multiple
        [hidden]="true"
        (change)="handleUploadFile($event)"
      />
      <ng-container *ngIf="countFileSelected$ | async as count">
        <ng-container *ngIf="count.length > 0">
          <div class="file-container">
            <ng-container *ngFor="let item of count; let i = index">
              <div class="file-item">
                <app-file-item-skeleton
                  (oDeleteitem)="handleDeleteFile($event)"
                  [item]="getFileByIndex(i)"
                  [count]="count.length"
                ></app-file-item-skeleton>
              </div>
            </ng-container>
          </div>
        </ng-container>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FileItemComponent, CommonModule, FileItemSkeleton],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true,
    },
    FileService,
  ],
})
export class UploadFileComponent implements ControlValueAccessor, OnInit {
  ngOnInit(): void {}

  //#region inject services
  private readonly fileService = inject(FileService);
  private readonly cdr = inject(ChangeDetectorRef);
  //#endregion inject services

  //#region bindings for control value assessor
  onChange = (value: unknown) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  files: Array<Record<string, unknown>> = [];
  //#endregion bindings for control value assessor

  //#region subjects
  currentFileUpload$ = new BehaviorSubject<number>(0);
  countFileSelected$ = new Subject<Array<number>>();
  filesSelected$ = new BehaviorSubject<Array<Record<string, unknown>>>([]);
  //#endregion subjects

  //#region mandatory for custom control value asessor
  writeValue(value: Array<Record<string, unknown>>): void {
    if (value) {
      this.files = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  //#endregion mandatory for custom control value asessor

  //#region handle upload file
  handleClickBtnUploadFile(input: HTMLInputElement) {
    _.set(input, 'value', null);
    input.click();
  }

  handleUploadFile(event: Event) {
    const files = _.get(event, 'target.files') as Array<File> | undefined;

    if (files && _.size(files)) {
      const uploadFileName = _.map(files, (file) => {
        return _.get(file, 'name');
      });

      //assume files are valid
      const newFiles = _.intersection(
        uploadFileName,
        _.map(_.cloneDeep(this.files), (file) => _.get(file, 'name'))
      );

      const concatNumber = _.size(files) - _.size(newFiles);

      this.countFileSelected$.next(
        new Array(_.size(this.files) + concatNumber)
      );
      const filterFile = _.filter(
        files,
        (file) => !newFiles.includes(_.get(file, 'name'))
      );
      if (!_.size(filterFile)) return;

      from(filterFile)
        .pipe(
          concatMap((file) => {
            return this.fileService.uploadFile(_.get(file, 'name'));
          })
        )
        .subscribe((file) => {
          if (file) {
            this.files = [...this.files, file];
            this.cdr.markForCheck();
          }
        });
    }
  }

  handleDeleteFile(fileName: unknown) {
    if (!fileName) return;

    this.files = _.filter(
      this.files,
      (file) => _.get(file, 'name') !== fileName
    );
    this.countFileSelected$.next(new Array(_.size(this.files)));
    this.cdr.markForCheck();
  }
  //#endregion handle upload file

  //#region getters, setters
  getFileByIndex(index: number): Record<string, unknown> | undefined {
    return this.files[index];
  }
  //#endregion getters, setters
}
