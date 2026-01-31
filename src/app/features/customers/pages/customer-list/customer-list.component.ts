import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customer.model';
import * as CustomerActions from '../../state/customer.actions';
import { selectCustomers, selectTotalPages, selectCurrentPage, selectIsLoading } from '../../state/customer.selectors';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent],
  template: `
    <div class="p-6">
      <!-- Page Header -->
      <app-page-header
        title="Customers"
        description="Manage your customer database"
        buttonText="+ Add Customer"
        buttonLink="/customers/create"
      />

      <!-- Customer Table -->
      <app-data-table
        [columns]="columns"
        [data]="(customers$ | async) || []"
        [actions]="actions"
        [loading]="(isLoading$ | async) || false"
        loadingMessage="Loading customers..."
        emptyMessage="No customers found. Add your first customer to get started."
        emptyIcon="👥"
        [trackBy]="trackByCustomer"
      />

      <!-- Pagination -->
      @if (totalPages > 0) {
        <div class="flex justify-between items-center mt-6 bg-[#111111] rounded-xl border border-gray-800 px-6 py-4">
          <div class="text-sm text-gray-400">
            Page {{ currentPage + 1 }} of {{ totalPages }}
          </div>
          <div class="flex gap-3">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 0"
              [class.opacity-50]="currentPage === 0"
              [class.cursor-not-allowed]="currentPage === 0"
              class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors disabled:hover:bg-gray-800"
            >
              Previous
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage >= totalPages - 1"
              [class.opacity-50]="currentPage >= totalPages - 1"
              [class.cursor-not-allowed]="currentPage >= totalPages - 1"
              class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors disabled:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class CustomerListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  customers$: Observable<Customer[]>;
  totalPages$: Observable<number>;
  currentPage$: Observable<number>;
  isLoading$: Observable<boolean>;
  
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  columns: TableColumn[] = [
    { key: 'id', label: '#', type: 'number', width: '80px' },
    { key: 'name', label: 'Customer Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'country', label: 'Country', type: 'text' }
  ];

  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (customer: Customer) => this.viewCustomer(customer)
    },
    {
      label: 'Edit',
      color: 'gray',
      action: (customer: Customer) => this.editCustomer(customer)
    },
    {
      label: 'Delete',
      color: 'red',
      action: (customer: Customer) => this.deleteCustomer(customer)
    }
  ];

  constructor() {
    this.customers$ = this.store.select(selectCustomers);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.isLoading$ = this.store.select(selectIsLoading);
    
    this.totalPages$.subscribe(total => this.totalPages = total);
    this.currentPage$.subscribe(page => this.currentPage = page);
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.store.dispatch(CustomerActions.loadCustomers({
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'id'
    }));
  }

  viewCustomer(customer: Customer): void {
    this.router.navigate(['/customers', customer.id]);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customers/edit', customer.id]);
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      console.log('Delete customer:', customer);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCustomers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  trackByCustomer = (customer: Customer) => customer.id;
}
