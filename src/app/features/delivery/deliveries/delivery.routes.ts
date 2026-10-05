import { Routes } from '@angular/router';
import { DeliveryList } from './pages/delivery-list/delivery-list';
import { DeliveryForm } from './pages/delivery-form/delivery-form';
import { DeliveryDetail } from './pages/delivery-detail/delivery-detail';
import { authGuard } from '../../../core/guards/auth.guard';
import { roleGuard } from '../../../core/guards/role.guard';
import { UserRole } from '../../../core/models/user-roles';

const FLEET = [UserRole.SUPERVISEUR_LIVRAISONS];

export default [
  {
    path: '',
    component: DeliveryList,
    canActivate: [authGuard]
  },
  {
    path: 'create',
    component: DeliveryForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: FLEET }
  },
  {
    path: ':id',
    component: DeliveryDetail,
    canActivate: [authGuard]
  }
] as Routes;
