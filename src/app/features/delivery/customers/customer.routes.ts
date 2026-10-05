import { Routes } from '@angular/router';
import { CustomerList } from './pages/customer-list/customer-list';
import { CustomerForm } from './pages/customer-form/customer-form';
import { CustomerDetail } from './pages/customer-detail/customer-detail';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

const COMMERCIAL = [UserRole.GESTIONNAIRE_COMMERCIAL];

export default [
  {
    path: '',
    component: CustomerList,
    canActivate: [authGuard]
  },
  {
    path: 'create',
    component: CustomerForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: COMMERCIAL }
  },
  {
    path: ':id',
    component: CustomerDetail,
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    component: CustomerForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: COMMERCIAL }
  }
] as Routes;
