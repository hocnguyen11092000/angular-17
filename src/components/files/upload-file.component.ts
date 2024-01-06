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
import { BehaviorSubject, Subject, concatMap, from, tap } from 'rxjs';
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
    </style>
    <div class="upload-file">
      <button (click)="file.click()">Tải tệp lên</button>
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
              <app-file-item-skeleton
                [item]="getFileByIndex(i)"
                [count]="count.length"
              ></app-file-item-skeleton>
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
  handleUploadFile(event: Event) {
    const files = _.get(event, 'target.files') as Array<File> | undefined;

    if (files && _.size(files)) {
      //assume files are valid
      this.countFileSelected$.next(new Array(_.size(files)));

      from(files)
        .pipe(
          concatMap((file) => {
            return this.fileService.uploadFile(_.get(file, 'name'));
          })
        )
        .subscribe((file) => {
          if (file) {
            this.files.push(file);
            this.cdr.markForCheck();
          }
        });
    }
  }
  //#endregion handle upload file

  //#region getters, setters
  getFileByIndex(index: number): Record<string, unknown> | undefined {
    return this.files[index];
  }
  //#endregion getters, setters
}
