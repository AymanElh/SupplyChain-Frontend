import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/supply/suppliers',
    pathMatch: "full"
  },
  {
    path: "supply/suppliers",
    loadChildren: () => import('./features/supply/suppliers/supplier.routes')
  },
  {
    path: 'supply/materials',
    loadChildren: () => import('./features/supply/raw-materials/material.route')
  },
  {
    path: 'supply/orders',
    loadChildren: () => import('./features/supply/supplier-orders/supplier-orders-routes')
  }
];
