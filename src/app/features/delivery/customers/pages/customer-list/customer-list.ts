import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CustomerResponse } from '../../models/customer.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table.component';
import { KeycloakService } from '../../../../../core/services/keycloak-service';
import { UserRole } from '../../../../../core/models/user-roles';

@Component({
  selector: 'app-customer-list',
  imports: [PageHeaderComponent, DataTableComponent],
  templateUrl: './customer-list.html'
})
export class CustomerList implements OnInit {
  private customerService = inject(CustomerService);
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  pageSize = signal<number>(10);
  sortBy = signal<string>('id');

  customers = this.customerService.customers;
  isLoading = this.customerService.isLoading;
  currentPage = this.customerService.currentPage;
  totalPages = this.customerService.totalPages;

  columns: TableColumn[] = [
    { key: 'id', label: '#', type: 'number', width: '80px' },
    { key: 'name', label: 'Customer', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' }
  ];

  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (customer: CustomerResponse) => this.router.navigate(['/delivery/customers', customer.id])
    },
    {
      label: 'Edit',
      color: 'yellow',
      show: () => this.keycloakService.hasRole(UserRole.GESTIONNAIRE_COMMERCIAL),
      action: (customer: CustomerResponse) => this.router.navigate(['/delivery/customers', customer.id, 'edit'])
    },
    {
      label: 'Delete',
      color: 'red',
      show: () => this.keycloakService.hasRole(UserRole.GESTIONNAIRE_COMMERCIAL),
      action: (customer: CustomerResponse) => this.onDelete(customer)
    }
  ];

  trackByCustomer = (customer: CustomerResponse) => customer.id;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.loadCustomers(this.currentPage(), this.pageSize(), this.sortBy()).subscribe();
  }

  onDelete(customer: CustomerResponse): void {
    if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => this.loadCustomers()
      });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.customerService.loadCustomers(this.currentPage() + 1, this.pageSize()).subscribe();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.customerService.loadCustomers(this.currentPage() - 1, this.pageSize()).subscribe();
    }
  }
}
