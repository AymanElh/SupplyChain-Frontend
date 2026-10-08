import { Routes } from "@angular/router";
import { OrderListComponent } from "./pages/order-list-component/order-list-component";
import { OrderFormComponent } from "./pages/order-form-component/order-form-component";
import { OrderDetailComponent } from "./pages/order-detail-component/order-detail-component";
import { authGuard } from "../../../core/guards/auth.guard";
import { roleGuard } from "../../../core/guards/role.guard";
import { UserRole } from "../../../core/models/user-roles";

const ORDERS_VIEW = [UserRole.RESPONSABLE_ACHATS, UserRole.SUPERVISEUR_LOGISTIQUE];

export default [
  {
    path: '',
    component: OrderListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ORDERS_VIEW, sectionName: 'Purchase Orders' }
  },
  {
    path: 'create',
    component: OrderFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.RESPONSABLE_ACHATS], sectionName: 'Create Purchase Order' }
  },
  {
    path: ':id',
    component: OrderDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ORDERS_VIEW, sectionName: 'Purchase Order Details' }
  }
] as Routes;
