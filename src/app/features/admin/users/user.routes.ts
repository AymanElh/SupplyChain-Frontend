import { Routes } from '@angular/router';
import { UserList } from './pages/user-list/user-list';
import { UserForm } from './pages/user-form/user-form';
import { UserDetail } from './pages/user-detail/user-detail';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

export default [
  {
    path: '',
    component: UserList,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'create',
    component: UserForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: ':id',
    component: UserDetail,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: ':id/edit',
    component: UserForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] }
  }
] as Routes;
