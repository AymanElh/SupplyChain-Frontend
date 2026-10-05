import { Injectable, signal } from '@angular/core';
import { RoleApiService } from './role-api.service';
import { tap } from 'rxjs';
import { RoleRequest, RoleResponse } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  constructor(
    private api: RoleApiService
  ) {
  }

  roles = signal<RoleResponse[]>([]);
  isLoading = signal<boolean>(false);

  loadRoles() {
    this.isLoading.set(true);
    return this.api.getAll().pipe(
      tap({
        next: (roles) => {
          this.roles.set(roles);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    );
  }

  getRole(id: number) {
    return this.api.getById(id);
  }

  createRole(role: RoleRequest) {
    return this.api.create(role).pipe(
      tap({
        next: (newRole) => {
          this.roles.update(curr => [...curr, newRole]);
        }
      })
    );
  }

  updateRole(id: number, role: RoleRequest) {
    return this.api.update(id, role);
  }

  deleteRole(id: number) {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.roles.update(current => current.filter(r => r.id !== id));
        }
      })
    );
  }
}
