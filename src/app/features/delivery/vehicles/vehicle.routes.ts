import {VehicleList} from './pages/vehicle-list/vehicle-list';
import {VehicleForm} from './pages/vehicle-form/vehicle-form';
import {VehicleDetail} from './pages/vehicle-detail/vehicle-detail';
import {Routes} from '@angular/router';
import {authGuard} from '../../../core/guards/auth.guard';
import {roleGuard} from '../../../core/guards/role.guard';
import {UserRole} from '../../../core/models/user-roles';


export default [
  {
    path: '',
    component: VehicleList,
    canActivate: [authGuard]
  },
  {
    path: 'create',
    component: VehicleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.SUPERVISEUR_LIVRAISONS] }
  },
  {
    path: ':id',
    component: VehicleDetail,
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    component: VehicleForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.SUPERVISEUR_LIVRAISONS] }
  }
] as Routes;
