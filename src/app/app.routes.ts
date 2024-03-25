import { Routes } from '@angular/router';
import { canLeavate } from '../guards/can-deactivate.guard';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const routes: Routes = [
  {
    path: 'cart-1',
    loadComponent: async () =>
      (await import('../components/cart/cart.component')).CartComponent,
    canDeactivate: [canLeavate],
    title: 'cart',
  },
  {
    path: 'form-array',
    loadComponent: async () =>
      (await import('../components/form-array/form-array.component'))
        .FormArrayComponent,
    title: 'form-array',
  },
  {
    path: 'files',
    loadComponent: async () =>
      (await import('../components/files/upload-file.component'))
        .UploadFileComponent,
    title: 'files',
  },
  {
    path: 'defer',
    loadComponent: async () =>
      (await import('../components/defer/defer.component')).DeferComponent,
    title: 'defer',
  },
  {
    path: 'defer/:id',
    loadComponent: async () =>
      (await import('../components/defer/defer.component')).DeferComponent,
    title: 'defer detail',
  },

  {
    path: '',
    children: [
      {
        path: 'cart',
        loadComponent: async () =>
          (await import('../components/files/upload-file.component'))
            .UploadFileComponent,
        title: 'files',
      },
    ],
  },
  {
    path: 'post',
    loadComponent: async () =>
      (await import('../components/post/post.component')).PostComponent,
    title: 'post',
  },
  {
    path: '',
    redirectTo: 'form-array',
    pathMatch: 'full',
  },
  {
    path: 'claim',
    children: [
      {
        path: '',
        canActivate: [() => inject(AuthService).isAuthenticated$],
        children: [
          {
            path: 'compose',
            loadComponent: async () =>
              (
                await import(
                  '../components/claim-compose/claim-compose.component'
                )
              ).ClaimCompose,
            title: 'claim-compose',
          },
        ],
      },
      {
        path: '',
        children: [
          {
            path: 'search',
            loadComponent: async () =>
              (
                await import(
                  '../components/claim-search/claim-search.component'
                )
              ).SearchClaim,
            title: 'claim-search',
          },
        ],
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'defer',
    pathMatch: 'full',
  },
];
