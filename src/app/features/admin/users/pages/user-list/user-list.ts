import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-user-list',
  imports: [PageHeaderComponent, DataTableComponent],
  templateUrl: './user-list.html'
})
export class UserList implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users = this.userService.users;
  isLoading = this.userService.isLoading;

  columns: TableColumn[] = [
    { key: 'id', label: '#', type: 'number', width: '80px' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'roleName', label: 'Role', type: 'text', width: '220px' }
  ];

  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (user: UserResponse) => this.router.navigate(['/admin/users', user.id])
    },
    {
      label: 'Edit',
      color: 'yellow',
      action: (user: UserResponse) => this.router.navigate(['/admin/users', user.id, 'edit'])
    },
    {
      label: 'Delete',
      color: 'red',
      action: (user: UserResponse) => this.onDelete(user)
    }
  ];

  trackByUser = (user: UserResponse) => user.id;

  ngOnInit(): void {
    this.userService.loadUsers().subscribe();
  }

  onDelete(user: UserResponse): void {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe();
    }
  }
}
