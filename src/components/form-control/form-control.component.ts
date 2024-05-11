import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControlDirective,
  FormControlStatus,
  NgControl,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import _ from 'lodash';
import {
  BehaviorSubject,
  filter,
  fromEvent,
  tap,
  takeWhile,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-form-control',
  template: `
    <h3>form control</h3>
    <ng-container
      *ngIf="{
        showError: showError$ | async,
        errors: errors$ | async
      } as templateState"
    >
      <div class="form-content">
        <div [class.error-wrap]="templateState.showError">
          <ng-content></ng-content>
        </div>

        @if(templateState.showError && templateState.errors) {
        <div class="feed-back">
          {{ templateState.errors | translate : errorsParams }}
        </div>
        }
      </div>
    </ng-container>
  `,
  styles: [
    `
      .feed-back {
        color: #ff4d4f;
        margin: 4px 0;
        font-size: 12px;
      }

      :host {
        ::ng-deep {
          .error-wrap input {
            border-color: #ff4d4f;
          }

          .error-wrap input::placeholder {
            color: #ff4d4f;
          }
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, NgIf, TranslateModule],
})
export class FormControlComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  constructor() {
    // console.log(this.errorsMessage, this.priority);
  }
  //#region contentChild, contentChildren
  @ContentChild(NgControl, { static: false }) control?: FormControlDirective;
  @ContentChild('control', { static: false }) ref?: ElementRef;
  //#endregion contentChild, contentChildren

  //#region inputs, outputs
  @Input() errorsMessage: Record<string, string> = {};
  @Input({ required: false }) showErrorOnBlur = true;
  @Input({ required: false }) priority: Array<string> | null = null;
  //#endregion inputs, outputs

  //#region variables
  errorTemplate: Record<string, string> = {
    required: 'INPUT.ERRORS.REQUIRED',
    minlength: 'INPUT.ERRORS.MINLENGTH',
  };

  errorsParams: Record<string, string> = {};
  //#endregion variables

  //#region subjects
  showError$ = new BehaviorSubject(false);
  errors$ = new BehaviorSubject<string>('');
  destroy$ = new Subject<void>();
  //#endregion subjects

  //#region services
  //#endregion services

  //#region life circles
  ngOnInit(): void {
    // console.log(this.errorsMessage, this.priority);
    this.errorTemplate = {
      ...this.errorTemplate,
      ...this.errorsMessage,
    };
  }

  ngAfterContentInit(): void {
    fromEvent(this.ref!.nativeElement, 'blur')
      .pipe(
        takeWhile(() => this.showErrorOnBlur),
        filter(() => !this.control?.valid),
        tap((_) => {
          this.handleCheckControlValid();
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          // console.log('finalize');
        })
      )
      .subscribe();

    this.control?.valueChanges
      ?.pipe(
        filter(() => !this.control?.valid),
        tap((_) => {
          if (this.control?.dirty) {
            this.handleCheckControlValid();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.control?.statusChanges
      ?.pipe(
        tap((status: FormControlStatus) => {
          if (status === 'VALID') {
            this.showError$.next(false);
            this.errors$.next('');
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion life circles

  handleCheckControlValid() {
    this.showError$.next(true);
    this.errors$.next(this.handleGetErrorMessage(this.control?.errors!));
  }

  handleGetErrorMessage(errors: Record<string, string>): string {
    let keyPicked = undefined;

    if (_.size(this.priority)) {
      keyPicked = _.find(this.priority, (key: string) => {
        return _.keys(errors).includes(key);
      });
    }

    const errorKey = keyPicked ?? _.head(_.keys(errors));
    const params = _.get(errors, errorKey!);

    if (
      typeof params === 'object' &&
      _.isPlainObject(params) &&
      _.size(params)
    ) {
      this.errorsParams = params;
    }

    return _.get(this.errorTemplate, errorKey!);
  }
}
