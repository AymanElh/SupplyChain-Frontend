import { Routes } from '@angular/router';
import { RoleList } from './pages/role-list/role-list';
import { RoleForm } from './pages/role-form/role-form';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

export default [
  {
    path: '',
    component: RoleList,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'create',
    component: RoleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: ':id/edit',
    component: RoleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] }
  }
] as Routes;
