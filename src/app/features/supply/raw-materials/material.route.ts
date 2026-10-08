import { Routes } from "@angular/router";
import { MaterialListComponent } from "./pages/material-list-component/material-list-component";
import { MaterialFormComponent } from './pages/material-form-component/material-form-component';
import { authGuard } from "../../../core/guards/auth.guard";
import { roleGuard } from "../../../core/guards/role.guard";
import { UserRole } from "../../../core/models/user-roles";

const MATERIALS = [UserRole.GESTIONNAIRE_APPROVISIONNEMENT];

export default [
  {
    path: '',
    component: MaterialListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: MATERIALS, sectionName: 'Raw Materials' }
  },
  {
    path: 'create',
    component: MaterialFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: MATERIALS, sectionName: 'Create Raw Material' }
  }
] as Routes;
