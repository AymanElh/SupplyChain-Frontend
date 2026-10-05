import { Component, inject, OnInit, signal, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../../services/delivery.service';
import { DeliveryResponse } from '../../models/delivery.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableAction, TableColumn } from '../../../../../shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { KeycloakService } from '../../../../../core/services/keycloak-service';
import { UserRole } from '../../../../../core/models/user-roles';

@Component({
  selector: 'app-delivery-list',
  imports: [CommonModule, PageHeaderComponent, DataTableComponent, StatusBadgeComponent],
  templateUrl: './delivery-list.html'
})
export class DeliveryList implements OnInit, AfterViewInit {
  private deliveryService = inject(DeliveryService);
  private keycloakService = inject(KeycloakService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('statusTpl') statusTpl!: TemplateRef<unknown>;
  @ViewChild('orderTpl') orderTpl!: TemplateRef<unknown>;

  pageSize = signal<number>(10);
  sortBy = signal<string>('id');

  deliveries = this.deliveryService.deliveries;
  isLoading = this.deliveryService.isLoading;
  currentPage = this.deliveryService.currentPage;
  totalPages = this.deliveryService.totalPages;
  customerIdFilter = this.deliveryService.customerIdFilter;

  columns: TableColumn[] = [];

  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (delivery: DeliveryResponse) => this.router.navigate(['/delivery/deliveries', delivery.id])
    },
    {
      label: 'Delete',
      color: 'red',
      show: () => this.keycloakService.hasRole(UserRole.SUPERVISEUR_LIVRAISONS),
      action: (delivery: DeliveryResponse) => this.onDelete(delivery)
    }
  ];

  trackByDelivery = (delivery: DeliveryResponse) => delivery.id;

  ngOnInit(): void {
    const customerId = this.route.snapshot.queryParamMap.get('customerId');
    this.deliveryService.setCustomerFilter(customerId ? +customerId : null);
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'id', label: '#', type: 'number', width: '80px' },
      { key: 'order', label: 'Order', type: 'custom', template: this.orderTpl },
      { key: 'driver', label: 'Driver', type: 'custom', template: this.driverTpl },
      { key: 'vehicle', label: 'Vehicle', type: 'custom', template: this.vehicleTpl },
      { key: 'deliveryDate', label: 'Delivery Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'custom', align: 'center', width: '170px', template: this.statusTpl }
    ];
  }

  @ViewChild('driverTpl') driverTpl!: TemplateRef<unknown>;
  @ViewChild('vehicleTpl') vehicleTpl!: TemplateRef<unknown>;

  loadDeliveries(): void {
    this.deliveryService.loadDeliveries(this.currentPage(), this.pageSize(), this.sortBy()).subscribe();
  }

  clearCustomerFilter(): void {
    this.router.navigate([], { queryParams: {} }).then(() => {
      this.deliveryService.setCustomerFilter(null);
    });
  }

  onRowClick(delivery: DeliveryResponse): void {
    this.router.navigate(['/delivery/deliveries', delivery.id]);
  }

  onDelete(delivery: DeliveryResponse): void {
    if (confirm(`Delete delivery #${delivery.id}?`)) {
      this.deliveryService.deleteDelivery(delivery.id).subscribe({
        next: () => this.loadDeliveries()
      });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.deliveryService.loadDeliveries(this.currentPage() + 1, this.pageSize()).subscribe();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.deliveryService.loadDeliveries(this.currentPage() - 1, this.pageSize()).subscribe();
    }
  }
}
