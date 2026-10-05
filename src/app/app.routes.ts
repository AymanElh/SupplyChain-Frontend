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
        loadChildren: () => import('./features/supply/suppliers/supplier.routes').then(m => m.default)
      },
      {
        path: 'supply/materials',
        loadChildren: () => import('./features/supply/raw-materials/material.route').then(m => m.default)
      },
      {
        path: 'supply/orders',
        loadChildren: () => import('./features/supply/supplier-orders/supplier-orders-routes').then(m => m.default)
      },
      {
        path: 'production/products',
        loadChildren: () => import('./features/production/products/product.routes').then(m => m.default)
      },
      {
        path: 'production/orders',
        loadChildren: () => import('./features/production/production-orders/production-order.routes').then(m => m.default)
      },
      {
        path: 'delivery/drivers',
        loadChildren: () => import('./features/delivery/drivers/driver.routes').then(m => m.default)
      },
      {
        path: 'delivery/vehicles',
        loadChildren: () => import('./features/delivery/vehicles/vehicle.routes').then(m => m.default)
      },
      {
        path: 'delivery/customers',
        loadChildren: () => import('./features/delivery/customers/customer.routes').then(m => m.default)
      },
      {
        path: 'delivery/customer-orders',
        loadChildren: () => import('./features/delivery/customer-orders/customer-order.routes').then(m => m.default)
      },
      {
        path: 'delivery/deliveries',
        loadChildren: () => import('./features/delivery/deliveries/delivery.routes').then(m => m.default)
      },
      {
        path: 'admin/users',
        loadChildren: () => import('./features/admin/users/user.routes').then(m => m.default)
      },
      {
        path: 'admin/roles',
        loadChildren: () => import('./features/admin/roles/role.routes').then(m => m.default)
      }
    ]
  }
];
