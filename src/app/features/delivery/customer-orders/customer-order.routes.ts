import { Routes } from '@angular/router';
import { CustomerOrderList } from './pages/customer-order-list/customer-order-list';
import { CustomerOrderForm } from './pages/customer-order-form/customer-order-form';
import { CustomerOrderDetail } from './pages/customer-order-detail/customer-order-detail';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

const CUSTOMER_ORDERS_VIEW = [UserRole.GESTIONNAIRE_COMMERCIAL, UserRole.SUPERVISEUR_LIVRAISONS];

export default [
  {
    path: '',
    component: CustomerOrderList,
    canActivate: [authGuard, roleGuard],
    data: { roles: CUSTOMER_ORDERS_VIEW, sectionName: 'Customer Orders' }
  },
  {
    path: 'create',
    component: CustomerOrderForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.GESTIONNAIRE_COMMERCIAL], sectionName: 'Create Customer Order' }
  },
  {
    path: ':id',
    component: CustomerOrderDetail,
    canActivate: [authGuard, roleGuard],
    data: { roles: CUSTOMER_ORDERS_VIEW, sectionName: 'Customer Order Details' }
  }
] as Routes;
