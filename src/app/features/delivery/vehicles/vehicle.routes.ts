import { VehicleList } from './pages/vehicle-list/vehicle-list';
import { VehicleForm } from './pages/vehicle-form/vehicle-form';
import { VehicleDetail } from './pages/vehicle-detail/vehicle-detail';
import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

const FLEET = [UserRole.SUPERVISEUR_LIVRAISONS];

export default [
  {
    path: '',
    component: VehicleList,
    canActivate: [authGuard, roleGuard],
    data: { roles: FLEET, sectionName: 'Vehicles' }
  },
  {
    path: 'create',
    component: VehicleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: FLEET, sectionName: 'Create Vehicle' }
  },
  {
    path: ':id',
    component: VehicleDetail,
    canActivate: [authGuard, roleGuard],
    data: { roles: FLEET, sectionName: 'Vehicle Details' }
  },
  {
    path: ':id/edit',
    component: VehicleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: FLEET, sectionName: 'Edit Vehicle' }
  }
] as Routes;
