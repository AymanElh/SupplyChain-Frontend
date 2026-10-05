import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerOrderService } from '../../services/customer-order.service';
import { CustomerOrderResponse, CustomerOrderStatus } from '../../models/customer-order.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { HasRoleDirective } from '../../../../../shared/directives/has-role.directive';
import { UserRole } from '../../../../../core/models/user-roles';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

const FLOW: CustomerOrderStatus[] = ['PENDING', 'IN_PREPARATION', 'READY', 'IN_WAY', 'DELIVERED'];

@Component({
  selector: 'app-customer-order-detail',
  imports: [CommonModule, RouterLink, PageHeaderComponent, StatusBadgeComponent, HasRoleDirective],
  templateUrl: './customer-order-detail.html'
})
export class CustomerOrderDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(CustomerOrderService);
  private notification = inject(NotificationService);

  protected readonly UserRole = UserRole;

  order = signal<CustomerOrderResponse | null>(null);
  isLoading = signal<boolean>(true);
  isActing = signal<boolean>(false);

  nextStatus = computed<CustomerOrderStatus | null>(() => {
    const current = this.order()?.status;
    if (!current) return null;
    const index = FLOW.indexOf(current);
    return index >= 0 && index < FLOW.length - 1 ? FLOW[index + 1] : null;
  });

  isTerminal = computed(() => {
    const status = this.order()?.status;
    return status === 'DELIVERED' || status === 'CANCELLED';
  });

  isReady = computed(() => this.order()?.status === 'READY');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(+id);
    }
  }

  loadOrder(id: number): void {
    this.isLoading.set(true);
    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading customer order:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isLoading.set(false);
        this.router.navigate(['/delivery/customer-orders']);
      }
    });
  }

  onAdvance(): void {
    const order = this.order();
    const next = this.nextStatus();
    if (!order || !next) return;
    this.runStatusUpdate(order.id, next, `Order #${order.id} moved to ${this.formatStatus(next)}`);
  }

  onCancelStatus(): void {
    const order = this.order();
    if (!order) return;
    if (!confirm(`Cancel customer order #${order.id}? Reserved stock will be released.`)) {
      return;
    }
    this.runStatusUpdate(order.id, 'CANCELLED', `Order #${order.id} cancelled`);
  }

  onDelete(): void {
    const order = this.order();
    if (!order) return;
    if (!confirm(`Delete customer order #${order.id}? This cannot be undone.`)) {
      return;
    }
    this.isActing.set(true);
    this.orderService.deleteOrder(order.id).subscribe({
      next: () => {
        this.notification.success('Success', `Order #${order.id} deleted`);
        this.isActing.set(false);
        this.router.navigate(['/delivery/customer-orders']);
      },
      error: (error) => {
        console.error('Error deleting customer order:', error);
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

  protected readonly flowPosition = computed(() => {
    const index = FLOW.indexOf(this.order()?.status as CustomerOrderStatus);
    return index >= 0 ? index : -1;
  });

  protected readonly flowSteps = FLOW;

  private runStatusUpdate(id: number, status: CustomerOrderStatus, successMessage: string): void {
    this.isActing.set(true);
    this.orderService.updateStatus(id, status).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.notification.success('Success', successMessage);
        this.isActing.set(false);
      },
      error: (error) => {
        console.error('Error updating customer order status:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isActing.set(false);
      }
    });
  }
}
