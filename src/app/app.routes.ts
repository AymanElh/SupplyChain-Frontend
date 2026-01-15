import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/supply/suppliers',
    pathMatch: "full"
  },
  {
    path: "supply/suppliers",
    canActivate: [authGuard],
    loadChildren: () => import('./features/supply/suppliers/supplier.routes')
  },
  {
    path: 'supply/materials',
    canActivate: [authGuard],
    loadChildren: () => import('./features/supply/raw-materials/material.route')
  },
  {
    path: 'supply/orders',
    canActivate: [authGuard],
    loadChildren: () => import('./features/supply/supplier-orders/supplier-orders-routes')
  }
];
