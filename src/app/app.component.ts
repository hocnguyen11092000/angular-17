import { Component, OnInit, computed, effect, inject } from '@angular/core';
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
import { CartService } from '../components/cart.service';

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
    name: ['', [Validators.required]],
    age: [''],
    address: new FormGroup({
      code: new FormControl('', [Validators.required]),
    }),
    cart: new FormArray([
      new FormGroup({
        productId: new FormControl('', [Validators.required]),
        productName: new FormControl('', [Validators.required]),
      }),
    ]),
  });
  config = {
    name: {
      validators: [Validators.required],
    },
    address: {
      code: {
        validators: [Validators.required],
      },
    },
    cart: [
      {
        productId: {
          validators: [Validators.required],
        },
      },
    ],
  };

  //#region inject services
  readonly cartService = inject(CartService);
  //#endregion inject services

  quantityEffect = effect(() => {
    console.log(`change from cart ${this.cartService.quantity$$()}`);
  });

  duplicateQuantity$$ = computed(() => {
    return this.cartService.quantity$$() * 2;
  });

  ngOnInit(): void {}

  //#region getter, setter
  get cartControls() {
    return (this.someForm.get('cart') as FormArray).controls;
  }
  //#endregion getter,

  //#region form handling
  handleSubmitForm() {
    if (this.someForm.valid) {
      console.log(this.someForm.getRawValue());
    } else {
      FormHelper.mutateForm(this.someForm, FormAction.TouchedAndDirty);
    }
  }

  handleClearValidator() {
    FormHelper.mutateForm(
      this.someForm,
      FormAction.ClearValidators,
      undefined,
      {
        updateValueAndValidity: true,
        formStatus: {
          markAsPristine: true,
          markAsUntouched: true,
        },
      }
    );
  }

  handleAddValidator() {
    FormHelper.mutateForm(
      this.someForm,
      FormAction.AddValidators,
      this.config,
      { updateValueAndValidity: true, formStatus: { markAsDirty: true } }
    );
  }
  //#endregion form handling
}
