import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cart',
    loadComponent: async () =>
      (await import('../components/cart/cart.component')).CartComponent,
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
