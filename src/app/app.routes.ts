import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/suppliers',
    pathMatch: "full"
  },
  {
    path: "suppliers",
    loadChildren: () => import('./features/supply/suppliers/supplier.routes')
  },
  {
    path: 'materials',
    loadChildren: () => import('./features/supply/raw-materials/material.route')
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/supply/supplier-orders/supplier-orders-routes')
  }
];
