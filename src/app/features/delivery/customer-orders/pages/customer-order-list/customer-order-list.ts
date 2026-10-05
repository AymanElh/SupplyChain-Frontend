import { Component, inject, OnInit, signal, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerOrderService } from '../../services/customer-order.service';
import { CUSTOMER_ORDER_STATUSES, CustomerOrderFilter, CustomerOrderResponse } from '../../models/customer-order.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table.component';
import { FilterTabsComponent, FilterTab } from '../../../../../shared/components/filter-tabs/filter-tabs.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { KeycloakService } from '../../../../../core/services/keycloak-service';
import { UserRole } from '../../../../../core/models/user-roles';

@Component({
  selector: 'app-customer-order-list',
  imports: [PageHeaderComponent, DataTableComponent, FilterTabsComponent, StatusBadgeComponent],
  templateUrl: './customer-order-list.html'
})
export class CustomerOrderList implements OnInit, AfterViewInit {
  private orderService = inject(CustomerOrderService);
  private keycloakService = inject(KeycloakService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('statusTpl') statusTpl!: TemplateRef<unknown>;

  pageSize = signal<number>(10);
  sortBy = signal<string>('id');

  orders = this.orderService.orders;
  isLoading = this.orderService.isLoading;
  currentPage = this.orderService.currentPage;
  totalPages = this.orderService.totalPages;
  filterStatus = this.orderService.filterStatus;
  customerIdFilter = this.orderService.customerIdFilter;

  filterTabs: FilterTab[] = [
    { label: 'All', value: 'ALL' },
    ...CUSTOMER_ORDER_STATUSES.map(status => ({
      label: this.formatStatus(status),
      value: status
    }))
  ];

  columns: TableColumn[] = [];

  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (order: CustomerOrderResponse) => this.router.navigate(['/delivery/customer-orders', order.id])
    },
    {
      label: 'Delete',
      color: 'red',
      show: () => this.keycloakService.hasRole(UserRole.GESTIONNAIRE_COMMERCIAL),
      action: (order: CustomerOrderResponse) => this.onDelete(order)
    }
  ];

  trackByOrder = (order: CustomerOrderResponse) => order.id;

  ngOnInit(): void {
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    this.orderService.setCustomerFilter(customerId ? +customerId : null);
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'id', label: '#', type: 'number', width: '80px' },
      { key: 'customer', label: 'Customer', type: 'custom', template: this.customerTpl },
      { key: 'orderDate', label: 'Date', type: 'date' },
      { key: 'quantity', label: 'Items', type: 'number', align: 'center', width: '90px' },
      { key: 'totalAmount', label: 'Total', type: 'number', align: 'right', width: '130px' },
      { key: 'status', label: 'Status', type: 'custom', align: 'center', width: '180px', template: this.statusTpl }
    ];
  }

  @ViewChild('customerTpl') customerTpl!: TemplateRef<unknown>;

  loadOrders(): void {
    this.orderService.loadOrders(this.currentPage(), this.pageSize(), this.sortBy()).subscribe();
  }

  setFilter(value: string): void {
    this.orderService.setFilter(value as CustomerOrderFilter);
  }

  clearCustomerFilter(): void {
    this.router.navigate([], { queryParams: {} }).then(() => {
      this.orderService.setCustomerFilter(null);
    });
  }

  onRowClick(order: CustomerOrderResponse): void {
    this.router.navigate(['/delivery/customer-orders', order.id]);
  }

  onDelete(order: CustomerOrderResponse): void {
    if (confirm(`Cancel and delete customer order #${order.id}? Stock will be released.`)) {
      this.orderService.deleteOrder(order.id).subscribe({
        next: () => this.loadOrders()
      });
    }
  }

  nextPage(): void {
    if (this.customerIdFilter() !== null) return;
    if (this.currentPage() < this.totalPages() - 1) {
      this.orderService.loadOrders(this.currentPage() + 1, this.pageSize()).subscribe();
    }
  }

  previousPage(): void {
    if (this.customerIdFilter() !== null) return;
    if (this.currentPage() > 0) {
      this.orderService.loadOrders(this.currentPage() - 1, this.pageSize()).subscribe();
    }
  }

  private formatStatus(status: string): string {
    return status
      .split('_')
      .map(part => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }
}
