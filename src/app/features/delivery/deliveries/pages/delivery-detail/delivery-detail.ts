import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../services/delivery.service';
import { DELIVERY_STATUSES, DeliveryResponse, DeliveryStatus } from '../../models/delivery.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { HasRoleDirective } from '../../../../../shared/directives/has-role.directive';
import { UserRole } from '../../../../../core/models/user-roles';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-delivery-detail',
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent, HasRoleDirective],
  templateUrl: './delivery-detail.html'
})
export class DeliveryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deliveryService = inject(DeliveryService);
  private notification = inject(NotificationService);

  protected readonly UserRole = UserRole;
  protected readonly statuses = DELIVERY_STATUSES;

  delivery = signal<DeliveryResponse | null>(null);
  isLoading = signal<boolean>(true);
  isActing = signal<boolean>(false);
  selectedStatus = signal<DeliveryStatus>('SCHEDULED');

  isTerminal = computed(() => {
    const status = this.delivery()?.status;
    return status === 'DELIVERED' || status === 'FAILED' || status === 'CANCELED';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDelivery(+id);
    }
  }

  loadDelivery(id: number): void {
    this.isLoading.set(true);
    this.deliveryService.getDelivery(id).subscribe({
      next: (delivery) => {
        this.delivery.set(delivery);
        this.selectedStatus.set(delivery.status);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading delivery:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isLoading.set(false);
        this.router.navigate(['/delivery/deliveries']);
      }
    });
  }

  onUpdateStatus(): void {
    const delivery = this.delivery();
    const status = this.selectedStatus();
    if (!delivery || status === delivery.status) return;
    this.isActing.set(true);
    this.deliveryService.updateStatus(delivery.id, status).subscribe({
      next: (updated) => {
        this.delivery.set(updated);
        this.notification.success('Success', `Delivery #${delivery.id} is now ${this.formatStatus(status)}`);
        this.isActing.set(false);
      },
      error: (error) => {
        console.error('Error updating delivery status:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isActing.set(false);
      }
    });
  }

  onDelete(): void {
    const delivery = this.delivery();
    if (!delivery) return;
    if (!confirm(`Delete delivery #${delivery.id}?`)) {
      return;
    }
    this.isActing.set(true);
    this.deliveryService.deleteDelivery(delivery.id).subscribe({
      next: () => {
        this.notification.success('Success', `Delivery #${delivery.id} deleted`);
        this.isActing.set(false);
        this.router.navigate(['/delivery/deliveries']);
      },
      error: (error) => {
        console.error('Error deleting delivery:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isActing.set(false);
      }
    });
  }

  formatStatus(status: string): string {
    return status
      .split('_')
      .map(part => part.charAt(0) + part.slice(1).toLowerCase())
      .join(' ');
  }
}
