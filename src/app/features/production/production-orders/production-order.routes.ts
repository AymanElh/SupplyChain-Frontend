import { Routes } from '@angular/router';
import { ProductionOrderList } from './pages/production-order-list/production-order-list';
import { ProductionOrderForm } from './pages/production-order-form/production-order-form';
import { ProductionOrderDetail } from './pages/production-order-detail/production-order-detail';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

export default [
  {
    path: '',
    component: ProductionOrderList,
    canActivate: [authGuard]
  },
  {
    path: 'create',
    component: ProductionOrderForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.CHEF_PRODUCTION] }
  },
  {
    path: ':id',
    component: ProductionOrderDetail,
    canActivate: [authGuard]
  }
] as Routes;
