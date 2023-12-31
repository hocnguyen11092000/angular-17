import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cart',
    loadComponent: async () =>
      (await import('../components/cart.component')).CartComponent,
  },
  {
    path: '**',
    redirectTo: 'cart',
    pathMatch: 'full',
  },
];
