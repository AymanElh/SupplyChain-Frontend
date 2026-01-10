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
  }
];
