import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionOrderService } from '../../services/production-order.service';
import { ProductionOrderResponse } from '../../models/production-order.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { HasRoleDirective } from '../../../../../shared/directives/has-role.directive';
import { UserRole } from '../../../../../core/models/user-roles';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-production-order-detail',
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent, HasRoleDirective],
  templateUrl: './production-order-detail.html'
})
export class ProductionOrderDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(ProductionOrderService);
  private notification = inject(NotificationService);

  protected readonly UserRole = UserRole;

  order = signal<ProductionOrderResponse | null>(null);
  isLoading = signal<boolean>(true);
  isActing = signal<boolean>(false);
  editingQuantity = signal<boolean>(false);
  draftQuantity = signal<number>(1);

  canStart = computed(() => this.order()?.status === 'IN_WAITING');
  canComplete = computed(() => this.order()?.status === 'IN_PRODUCTION');
  canEditQuantity = computed(() => this.order()?.status === 'IN_WAITING');
  canCancel = computed(() => this.order()?.status === 'IN_WAITING');
  isBlocked = computed(() => this.order()?.status === 'BLOCKED');
  isFinished = computed(() => this.order()?.status === 'FINISHED');

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
        this.draftQuantity.set(order.quantity);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading production order:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isLoading.set(false);
        this.router.navigate(['/production/orders']);
      }
    });
  }

  onStart(): void {
    const order = this.order();
    if (!order) return;
    if (!confirm(`Start production of ${order.quantity} × ${order.productName}? Required raw materials will be consumed from stock.`)) {
      return;
    }
    this.runAction(
      this.orderService.startProduction(order.id),
      `Production started for order #${order.id}`
    );
  }

  onComplete(): void {
    const order = this.order();
    if (!order) return;
    if (!confirm(`Mark order #${order.id} as finished? ${order.quantity} units will be added to ${order.productName} stock.`)) {
      return;
    }
    this.runAction(
      this.orderService.completeProduction(order.id),
      `Order #${order.id} marked as finished`
    );
  }

  onBlock(): void {
    const order = this.order();
    if (!order) return;
    if (!confirm(`Block order #${order.id}? It will pause until unblocked.`)) {
      return;
    }
    this.runAction(
      this.orderService.updateStatus(order.id, 'BLOCKED'),
      `Order #${order.id} blocked`
    );
  }

  onUnblock(): void {
    const order = this.order();
    if (!order) return;
    this.runAction(
      this.orderService.updateStatus(order.id, 'IN_WAITING'),
      `Order #${order.id} moved back to waiting queue`
    );
  }

  onSaveQuantity(): void {
    const order = this.order();
    const quantity = Math.floor(this.draftQuantity());
    if (!order || !quantity || quantity < 1) {
      return;
    }
    this.runAction(
      this.orderService.updateQuantity(order.id, quantity),
      `Quantity updated to ${quantity}`,
      () => this.editingQuantity.set(false)
    );
  }

  onCancelOrder(): void {
    const order = this.order();
    if (!order) return;
    if (!confirm(`Cancel production order #${order.id}? This cannot be undone.`)) {
      return;
    }
    this.isActing.set(true);
    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        this.notification.success('Success', `Order #${order.id} cancelled`);
        this.isActing.set(false);
        this.router.navigate(['/production/orders']);
      },
      error: (error) => {
        console.error('Error cancelling production order:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isActing.set(false);
      }
    });
  }

  private runAction(
    request: ReturnType<ProductionOrderService['startProduction']>,
    successMessage: string,
    onSuccess?: () => void
  ): void {
    this.isActing.set(true);
    request.subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.draftQuantity.set(updated.quantity);
        this.notification.success('Success', successMessage);
        this.isActing.set(false);
        onSuccess?.();
      },
      error: (error) => {
        console.error('Production order action failed:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isActing.set(false);
      }
    });
  }
}
