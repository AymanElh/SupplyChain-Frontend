import { SupplierList } from './pages/supplier-list/supplier-list';
import { SupplierForm } from './pages/supplier-form/supplier-form';
import { SupplierDetail } from './pages/supplier-detail/supplier-detail';
import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

const SUPPLIER_VIEW = [UserRole.RESPONSABLE_ACHATS, UserRole.GESTIONNAIRE_APPROVISIONNEMENT];

export default [
  {
    path: '',
    component: SupplierList,
    canActivate: [authGuard, roleGuard],
    data: { roles: SUPPLIER_VIEW, sectionName: 'Suppliers' }
  },
  {
    path: 'create',
    component: SupplierForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN], sectionName: 'Create Supplier' }
  },
  {
    path: ':id',
    component: SupplierDetail,
    canActivate: [authGuard, roleGuard],
    data: { roles: SUPPLIER_VIEW, sectionName: 'Supplier Details' }
  },
  {
    path: ':id/edit',
    component: SupplierForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.GESTIONNAIRE_APPROVISIONNEMENT], sectionName: 'Edit Supplier' }
  }
] as Routes;
