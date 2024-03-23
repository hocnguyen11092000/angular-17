import { CommonModule } from '@angular/common';
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
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from '../components/cart/cart.service';
import { FormControlComponent } from '../components/form-control/form-control.component';
import { AppInputDirective } from '../directives/app-input.directive';
import { FormAction } from '../enums/form.enum';
import { FormHelper } from '../helpers/form.helper';
import { I18nService } from '../services/i18n.service';
import { TestService } from '../services/test.service';
import { TemplatePageTitleStrategy } from '../services/title.service';
import { UrlService } from '../services/url.service';
import { scoreValidator } from '../validators/common.validator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormControlComponent,
    AppInputDirective,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [TestService],
})
export class AppComponent implements OnInit {
  title = 'toggle-validators';
  currentLang = 'vi';
  langs: Array<string> = [];
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
  previousUrl: string = '';
  currentUrl: string = '';

  //#region inject services
  private readonly activateRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(TemplatePageTitleStrategy);
  private readonly injector = inject(Injector);
  private readonly enviInjector = inject(EnvironmentInjector);
  readonly testService = inject(TestService);
  private readonly urlService = inject(UrlService);
  private readonly i18nService = inject(I18nService);

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
  readonly testFormControl = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(5), scoreValidator]],
    email: ['', [Validators.required, scoreValidator]],
  });

  quantityEffect = effect(() => {
    console.log(`change from cart ${this.cartService.quantity$$()}`);
  });

  duplicateQuantity$$ = computed(() => {
    return this.cartService.quantity$$() * 2;
  });

  ngOnInit(): void {
    this.langs = this.i18nService.langs;
    this.i18nService.hanleBootstrapTranslation();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.urlService.setPreviousUrl(this.urlService.current);
        this.urlService.setCurrentUrl(event.url);

        console.log(this.urlService.pre, this.urlService.current);
      });

    this.testService.setName('app');

    // this.router.navigate(['.'], {
    //   queryParams: { test: 'âfafaf' },
    //   relativeTo: this.activateRoute,
    // });
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

  //#region handle lang changes
  handleChangeLang(lang: string): void {
    this.i18nService.use(lang);
  }
  //#endregion handle lang changes

  //#region $any
  hanleInputValue(value: string) {
    console.log(value);
  }
  //#endregion $any
}
