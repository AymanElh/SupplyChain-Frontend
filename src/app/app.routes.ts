import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: "full"
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
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
      },
      {
        path: 'production/products',
        loadChildren: () => import('./features/production/products/product.routes')
      }
    ]
  }
];
