import { Routes } from '@angular/router';
import { ProductionOrderList } from './pages/production-order-list/production-order-list';
import { ProductionOrderForm } from './pages/production-order-form/production-order-form';
import { ProductionOrderDetail } from './pages/production-order-detail/production-order-detail';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

const PROD_ORDERS_VIEW = [
  UserRole.CHEF_PRODUCTION,
  UserRole.SUPERVISEUR_PRODUCTION,
  UserRole.PLANIFICATEUR
];

export default [
  {
    path: '',
    component: ProductionOrderList,
    canActivate: [authGuard, roleGuard],
    data: { roles: PROD_ORDERS_VIEW, sectionName: 'Production Orders' }
  },
  {
    path: 'create',
    component: ProductionOrderForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.CHEF_PRODUCTION], sectionName: 'Create Production Order' }
  },
  {
    path: ':id',
    component: ProductionOrderDetail,
    canActivate: [authGuard, roleGuard],
    data: { roles: PROD_ORDERS_VIEW, sectionName: 'Production Order Details' }
  }
] as Routes;
