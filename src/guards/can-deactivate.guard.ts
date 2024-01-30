import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export const canLeavate: CanDeactivateFn<any> = (
  component: any
): Observable<boolean> | boolean => {
  if (component?.isChanged) {
    return confirm(
      'Are you sure you want to leave this page? If you do, any unsaved changes will be lost.'
    );
  }

  return true;
};
