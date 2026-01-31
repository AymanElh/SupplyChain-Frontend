import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/customer-list/customer-list.component').then(m => m.CustomerListComponent)
  },
];
