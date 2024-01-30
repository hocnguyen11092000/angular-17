import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import _, { random } from 'lodash';

@Component({
  selector: 'app-form-array',
  template: `
    <h3>hello from form array</h3>
    <form [formGroup]="formArray" (ngSubmit)="handleSubmitForm()">
      <div formArrayName="array">
        @for(item of formArrayControl; let idx = $index; track idx) {
        <div class="form-group" style="margin: 12px;">
          <input type="text" [formControlName]="idx" [placeholder]="idx" />
        </div>
        }
      </div>
      <button>submit</button>
    </form>
    <button (click)="handleRandomPatchValue()">random patch value</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class FormArrayComponent implements OnInit {
  readonly formArray = inject(NonNullableFormBuilder).group({
    array: new FormArray([]),
  });

  ngOnInit(): void {
    _.forEach(_.times(10, _.constant(0)), () => {
      this.addFormArray();
    });
  }

  get formArrayControl() {
    return (this.formArray.get('array') as FormArray).controls;
  }

  get array() {
    return this.formArray.get('array') as FormArray;
  }

  addFormArray() {
    this.array.push(new FormControl([]));
  }

  handleSubmitForm() {
    console.log(
      this.formArray.getRawValue(),
      _.flattenDeep(this.array.getRawValue())
    );
  }

  handleRandomPatchValue() {
    const randomNumber = Math.floor(Math.random() * 10);

    this.array.at(randomNumber).patchValue({});
  }
}
