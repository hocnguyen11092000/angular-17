import { CommonModule, PlatformLocation } from '@angular/common';
import {
  Component,
  EnvironmentInjector,
  Injector,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  TitleStrategy,
} from '@angular/router';
import { CartService } from '../components/cart/cart.service';
import { FormAction } from '../enums/form.enum';
import { FormHelper } from '../helpers/form.helper';
import { TemplatePageTitleStrategy } from '../services/title.service';
import { Title } from '@angular/platform-browser';
import { InjectableFc } from '../utils/inject-fc.util';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [TestService],
})
export class AppComponent implements OnInit {
  title = 'toggle-validators';
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
  private readonly activateRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(TemplatePageTitleStrategy);
  private readonly injector = inject(Injector);
  private readonly enviInjector = inject(EnvironmentInjector);
  readonly testService = inject(TestService);

  readonly cartService = inject(CartService);
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
  //#endregion inject services

  quantityEffect = effect(() => {
    console.log(`change from cart ${this.cartService.quantity$$()}`);
  });

  duplicateQuantity$$ = computed(() => {
    return this.cartService.quantity$$() * 2;
  });

  ngOnInit(): void {
    console.log(InjectableFc(this.injector, this.enviInjector));
    this.testService.setName('app');

    // this.router.navigate(['.'], {
    //   queryParams: { test: 'âfafaf' },
    //   relativeTo: this.activateRoute,
    // });

    console.log(this.someForm);
  }

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
      FormHelper.mutateForm(
        this.someForm.get('cart') as FormArray,
        FormAction.TouchedAndDirty
      );
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

    console.log(this.someForm);
  }

  handleAddValidator() {
    FormHelper.mutateForm(
      this.someForm,
      FormAction.AddValidators,
      this.config,
      { updateValueAndValidity: true, formStatus: { markAsDirty: true } }
    );
  }

  handleResetForm() {
    FormHelper.mutateForm(this.someForm, FormAction.Reset, undefined, {
      resetValue: { name: 'name' },
    });
    console.log(this.someForm);
  }

  handleClearErrors() {
    FormHelper.mutateForm(this.someForm, FormAction.ClearErrors);
    console.log(this.someForm);
  }

  handleMarkAsPristine() {
    FormHelper.mutateForm(this.someForm, FormAction.Pristine, undefined, {
      updateValueAndValidity: true,
    });
    console.log(this.someForm);
  }

  handleMixinFormStatus() {
    FormHelper.mutateForm(this.someForm, FormAction.Mixin, undefined, {
      formStatus: {
        markAsDirty: true,
        markAsTouched: true,
      },
    });
    console.log(this.someForm);
  }

  handleNavigate() {
    this.router.navigate(['.'], {
      queryParams: { test: Math.random() },
      relativeTo: this.activateRoute,
      // replaceUrl: true,
    });
  }
  //#endregion form handling
}
