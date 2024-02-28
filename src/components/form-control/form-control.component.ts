import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormControlDirective,
  FormControlStatus,
  NgControl,
} from '@angular/forms';
import _ from 'lodash';
import { BehaviorSubject, fromEvent, map, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-form-control',
  template: `
    <h3>form control</h3>
    <div class="form-content">
      <ng-content></ng-content>

      @if((showError$ | async)) {
      <ng-container *ngIf="errors$ | async as error">
        <div class="feed-back">{{ error }}</div>
      </ng-container>
      }
    </div>
  `,
  styles: [
    `
      .feed-back {
        color: #ff4d4f;
        margin: 4px 0;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, NgIf],
})
export class FormControlComponent implements OnInit, AfterContentInit {
  //#region contentChild, contentChildren
  @ContentChild(NgControl, { static: false }) control?: FormControlDirective;
  @ContentChild('control', { static: false }) ref?: ElementRef;
  //#endregion contentChild, contentChildren

  //#region inputs, outputs
  @Input() errorsMessage: Record<string, string> = {};
  //#endregion inputs, outputs

  //#region variables
  errorTemplate: Record<string, string> = {
    required: 'This field is required',
  };
  //#endregion variables

  //#region subjects
  showError$ = new BehaviorSubject(false);
  errors$ = new BehaviorSubject<string>('');
  //#endregion subjects

  //#region services
  //#endregion services

  //#region life circles
  ngOnInit(): void {
    this.errorTemplate = {
      ...this.errorTemplate,
      ...this.errorsMessage,
    };
  }

  ngAfterContentInit(): void {
    fromEvent(this.ref!.nativeElement, 'blur')
      .pipe(
        tap((_) => {
          this.showError$.next(true);

          this.handleCheckControlValid();
        })
      )
      .subscribe();

    this.control?.valueChanges
      ?.pipe(
        tap((_) => {
          this.handleCheckControlValid();
        })
      )
      .subscribe();
  }
  //#endregion life circles

  handleCheckControlValid() {
    if (this.control && this.control.invalid) {
      this.showError$.next(true);

      console.log(this.control.errors);

      this.errors$.next(this.handleGetErrorMessage(this.control.errors!));
    } else {
      this.showError$.next(false);
      this.errors$.next('');
    }
  }

  handleGetErrorMessage(errors: Record<string, string>): string {
    const errorKey = _.head(_.keys(errors));

    return _.get(this.errorTemplate, errorKey!);
  }
}
