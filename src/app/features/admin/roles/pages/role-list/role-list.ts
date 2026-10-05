import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { RoleResponse } from '../../models/role.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './role-list.html'
})
export class RoleList implements OnInit {
  private roleService = inject(RoleService);
  private router = inject(Router);

  roles = this.roleService.roles;
  isLoading = this.roleService.isLoading;
  roleName = signal<string>('');

  columns: TableColumn[] = [
    { key: 'id', label: '#', type: 'number', width: '80px' },
    { key: 'name', label: 'Role Name', type: 'text' }
  ];

  actions: TableAction[] = [
    {
      label: 'Edit',
      color: 'yellow',
      action: (role: RoleResponse) => this.router.navigate(['/admin/roles', role.id, 'edit'])
    },
    {
      label: 'Delete',
      color: 'red',
      action: (role: RoleResponse) => this.onDelete(role)
    }
  ];

  trackByRole = (role: RoleResponse) => role.id;

  ngOnInit(): void {
    this.roleService.loadRoles().subscribe();
  }

  onCreateQuick(): void {
    const name = this.roleName().trim().toUpperCase().replace(/\s+/g, '_');
    if (!name) return;
    this.roleService.createRole({ name }).subscribe({
      next: () => this.roleName.set('')
    });
  }

  onDelete(role: RoleResponse): void {
    if (confirm(`Delete role ${role.name}? Users holding this role may lose access.`)) {
      this.roleService.deleteRole(role.id).subscribe();
    }
  }
}
