import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as _ from 'lodash';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormHelper } from '../helpers/form.helper';
import { FormAction } from '../enums/form.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'toggle-validators';
  readonly someForm = inject(NonNullableFormBuilder).group({
    name: [''],
    age: [''],
    address: new FormGroup({
      code: new FormControl(''),
    }),
    cart: new FormArray([
      new FormGroup({
        productId: new FormControl(''),
        productName: new FormControl(''),
      }),
    ]),
  });

  ngOnInit(): void {}

  //#region getter, setter
  get cartControls() {
    return (this.someForm.get('cart') as FormArray).controls;
  }
  //#endregion getter,

  //#region form handling
  handleSubmitForm() {
    const config = {
      name: {
        validators: [Validators.required],
      },
      address: {
        code: {
          validators: [Validators.required],
        },
      },
      cart: [{ productId: [Validators.required] }],
    };
    FormHelper.mutateForm(this.someForm, FormAction.AddValidators, config);
  }
  //#endregion form handling
}
