import {DriverList} from './pages/driver-list/driver-list';
import {DriverForm} from './pages/driver-form/driver-form';
import {Routes} from '@angular/router';
import {authGuard} from '../../../core/guards/auth.guard';
import {roleGuard} from '../../../core/guards/role.guard';
import {UserRole} from '../../../core/models/user-roles';


export default [
  {
    path: '',
    component: DriverList,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.SUPERVISEUR_LIVRAISONS] }
  },
  {
    path: 'create',
    component: DriverForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.SUPERVISEUR_LIVRAISONS] }
  }
] as Routes;
