import { AbstractControl, ValidationErrors } from '@angular/forms';
import _ from 'lodash';

export const scoreValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = _.get(control, 'value', '');
  const toNumberValue = +value;

  if (!value) return null;

  return toNumberValue > 0 && toNumberValue <= 10
    ? null
    : {
        score: {
          from: 1,
          to: 10,
        },
      };
};
