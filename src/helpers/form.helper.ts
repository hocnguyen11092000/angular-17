import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import _, { extend } from 'lodash';
import { FormAction } from '../enums/form.enum';

export class FormHelper {
  static mutateForm<F extends AbstractControl, CF extends object>(
    form: F,
    action: FormAction,
    config?: CF
  ) {
    if (form instanceof FormControl) {
      switch (action) {
        case FormAction.Dirty:
          form.markAsDirty();
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
        case FormAction.AddValidators:
          if (config) {
            const validators = (_.get(config, 'validators') ||
              []) as Array<ValidatorFn>;

            form.setValidators(validators);
            form.updateValueAndValidity();
          }
          break;
        default:
          break;
      }
    }

    if (form instanceof FormGroup) {
      this.mutateFormGroup(_.get(form, 'controls'), action, config);
    }

    if (form instanceof FormArray) {
      _.forEach(_.get(form, 'controls'), (groupControl: any) => {
        this.mutateFormGroup(_.get(groupControl, 'controls'), action, config);
      });
    }

    console.log(form);
  }

  static mutateFormGroup<CF extends object>(
    controls: Record<string, AbstractControl>,
    action: FormAction,
    config?: CF
  ) {
    _.forEach(_.values(controls), (control: AbstractControl) => {
      const controlName = this.getControlName(control);
      const currentConfig = controlName ? _.get(config, controlName) : {};

      this.mutateForm(control, action, currentConfig);
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
