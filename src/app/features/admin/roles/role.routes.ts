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
    data: { roles: [UserRole.ADMIN], sectionName: 'Role Management' }
  },
  {
    path: 'create',
    component: RoleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN], sectionName: 'Create Role' }
  },
  {
    path: ':id/edit',
    component: RoleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN], sectionName: 'Edit Role' }
  }
] as Routes;
