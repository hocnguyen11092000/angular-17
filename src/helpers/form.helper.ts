import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import _ from 'lodash';
import { FormAction } from '../enums/form.enum';
import { IFormHelperOptions } from '../interfaces/form-hepler.interface';

export class FormHelper {
  static mutateForm<F extends AbstractControl, CF extends object>(
    form: F,
    action: FormAction,
    config?: CF,
    options?: IFormHelperOptions
  ) {
    if (form instanceof FormControl) {
      switch (action) {
        case FormAction.Mixin:
          // TODO: set at options parameter
          break;
        case FormAction.Dirty:
          form.markAsDirty();
          break;
        case FormAction.TouchedAndDirty:
          form.markAsDirty();
          form.markAsTouched();
          break;
        case FormAction.Pristine:
          form.markAsPristine();
          break;
        case FormAction.Touched:
          form.markAsTouched();
          break;
        case FormAction.Untouched:
          form.markAsTouched();
          break;
        case FormAction.Reset:
          form.reset(_.get(options, 'resetValue', undefined));
          break;
        case FormAction.ClearErrors:
          form.setErrors(null);
          break;
        case FormAction.AddValidators:
          if (config) {
            const validators = (_.get(config, 'validators') ||
              []) as Array<ValidatorFn>;

            form.setValidators(validators);
          }
          break;
        case FormAction.ClearValidators:
          form.clearValidators();
          break;
        default:
          break;
      }

      if (options) {
        const { updateValueAndValidity, updateValidityOptions, formStatus } =
          options;

        if (updateValueAndValidity) {
          form.updateValueAndValidity(updateValidityOptions);
        }

        if (!_.isEmpty(formStatus)) {
          _.forEach(_.keys(formStatus), (key) => {
            if (key) {
              _.result(form, key);
            }
          });
        }
      }
    }

    if (form instanceof FormGroup) {
      this.mutateFormGroup(_.get(form, 'controls'), action, config, options);
    }

    if (form instanceof FormArray) {
      _.forEach(
        _.get(form, 'controls'),
        (groupControl: AbstractControl<unknown, unknown>, index: number) => {
          this.mutateFormGroup(
            _.get(groupControl, 'controls') || {},
            action,
            _.get(config, `[${index}]`),
            options
          );
        }
      );
    }
  }

  static mutateFormGroup<CF extends object>(
    controls: Record<string, AbstractControl>,
    action: FormAction,
    config?: CF,
    options?: IFormHelperOptions
  ) {
    _.forEach(_.values(controls), (control: AbstractControl) => {
      const controlName = this.getControlName(control);
      const currentConfig = controlName ? _.get(config, controlName) : {};

      this.mutateForm(control, action, currentConfig, options);
    });
  }

  static getControlName(control: AbstractControl): string | undefined {
    const parentForm = _.get(control, 'parent.controls');

    if (!_.size(parentForm)) return undefined;

    return _.find(
      _.keys(parentForm),
      (name) => control === _.get(parentForm, name)
    );
  }
}
