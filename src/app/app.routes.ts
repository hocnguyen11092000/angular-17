import { Routes } from '@angular/router';
import { canLeavate } from '../guards/can-deactivate.guard';

export const routes: Routes = [
  {
    path: 'cart',
    loadComponent: async () =>
      (await import('../components/cart/cart.component')).CartComponent,
    canDeactivate: [canLeavate],
  },
  {
    path: 'form-array',
    loadComponent: async () =>
      (await import('../components/form-array/form-array.component'))
        .FormArrayComponent,
  },
  {
    path: 'files',
    loadComponent: async () =>
      (await import('../components/files/upload-file.component'))
        .UploadFileComponent,
  },
  {
    path: '**',
    redirectTo: 'form-array',
    pathMatch: 'full',
  },
];
