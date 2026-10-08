import { ProductList } from './pages/product-list/product-list';
import { ProductForm } from './pages/product-form/product-form';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

const PRODUCTS_VIEW = [UserRole.CHEF_PRODUCTION, UserRole.SUPERVISEUR_PRODUCTION];

export default [
  {
    path: '',
    component: ProductList,
    canActivate: [authGuard, roleGuard],
    data: { roles: PRODUCTS_VIEW, sectionName: 'Products' }
  },
  {
    path: 'create',
    component: ProductForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.CHEF_PRODUCTION], sectionName: 'Create Product' }
  },
  {
    path: ':id',
    component: ProductDetail,
    canActivate: [authGuard, roleGuard],
    data: { roles: PRODUCTS_VIEW, sectionName: 'Product Details' }
  },
  {
    path: ':id/edit',
    component: ProductForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.CHEF_PRODUCTION], sectionName: 'Edit Product' }
  }
] as Routes;
