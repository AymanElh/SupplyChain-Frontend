import { Component, inject, OnInit, signal, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductionOrderService } from '../../services/production-order.service';
import { KeycloakService } from '../../../../../core/services/keycloak-service';
import { PRODUCTION_STATUSES, ProductionOrderFilter, ProductionOrderResponse } from '../../models/production-order.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table.component';
import { FilterTabsComponent, FilterTab } from '../../../../../shared/components/filter-tabs/filter-tabs.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { UserRole } from '../../../../../core/models/user-roles';

@Component({
  selector: 'app-production-order-list',
  imports: [PageHeaderComponent, DataTableComponent, FilterTabsComponent, StatusBadgeComponent],
  templateUrl: './production-order-list.html'
})
export class ProductionOrderList implements OnInit, AfterViewInit {
  private orderService = inject(ProductionOrderService);
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  @ViewChild('statusTpl') statusTpl!: TemplateRef<unknown>;

  protected readonly UserRole = UserRole;

  pageSize = signal<number>(10);
  sortBy = signal<string>('id');

  orders = this.orderService.orders;
  isLoading = this.orderService.isLoading;
  currentPage = this.orderService.currentPage;
  totalPages = this.orderService.totalPages;
  filterStatus = this.orderService.filterStatus;

  filterTabs: FilterTab[] = [
    { label: 'All Orders', value: 'ALL' },
    ...PRODUCTION_STATUSES.map(status => ({
      label: this.formatStatus(status),
      value: status
    }))
  ];

  columns: TableColumn[] = [];

  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (order: ProductionOrderResponse) => this.router.navigate(['/production/orders', order.id])
    },
    {
      label: 'Cancel',
      color: 'red',
      show: (order: ProductionOrderResponse) =>
        order.status === 'IN_WAITING' && this.keycloakService.hasRole(UserRole.CHEF_PRODUCTION),
      action: (order: ProductionOrderResponse) => this.onCancel(order)
    }
  ];

  trackByOrder = (order: ProductionOrderResponse) => order.id;

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'id', label: '#', type: 'number', width: '80px' },
      { key: 'productName', label: 'Product', type: 'text' },
      { key: 'quantity', label: 'Qty', type: 'number', align: 'center', width: '90px' },
      { key: 'priority', label: 'Priority', type: 'number', align: 'center', width: '100px' },
      { key: 'status', label: 'Status', type: 'custom', align: 'center', width: '180px', template: this.statusTpl },
      { key: 'startDate', label: 'Start', type: 'date' },
      { key: 'endDate', label: 'End', type: 'date' }
    ];
  }

  loadOrders(): void {
    this.orderService.loadOrders(this.currentPage(), this.pageSize(), this.sortBy()).subscribe();
  }

  setFilter(value: string): void {
    this.orderService.setFilter(value as ProductionOrderFilter);
  }

  onRowClick(order: ProductionOrderResponse): void {
    this.router.navigate(['/production/orders', order.id]);
  }

  onCancel(order: ProductionOrderResponse): void {
    if (order.status !== 'IN_WAITING') {
      return;
    }
    if (confirm(`Cancel production order #${order.id} for ${order.productName}?`)) {
      this.orderService.cancelOrder(order.id).subscribe({
        next: () => this.loadOrders()
      });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.orderService.loadOrders(this.currentPage() + 1, this.pageSize()).subscribe();
    }
  }

  previousPage(): void {
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
