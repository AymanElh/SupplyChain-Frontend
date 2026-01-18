import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierOrderService } from '../../services/supplier-order-service';
import { SupplierOrderResponse, OrderStatus } from '../../models/supplier-order-model';
import { DecimalPipe } from '@angular/common';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-order-detail-component',
  imports: [RouterLink, DecimalPipe, StatusBadgeComponent],
  templateUrl: './order-detail-component.html',
  styleUrl: './order-detail-component.css',
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(SupplierOrderService);
  private notification = inject(NotificationService);

  order = signal<SupplierOrderResponse | null>(null);
  isLoading = signal<boolean>(true);

  // Expose for template
  SupplierOrderStatus = OrderStatus;
  // getStatusInfo = getStatusInfo;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(+id);
    }
  }

  private loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        console.log("Got order: ", order);
        
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/supplier-orders']);
      }
    });
  }

  onUpdateStatus(newStatus: OrderStatus): void {
    const order = this.order();
    if (!order) return;

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.notification.success("success", "Order status updated successfully");
      }
    });
  }

  onDelete(): void {
    const order = this.order();
    if (!order) return;

    if (confirm(`Delete order #${order.id}?`)) {
      this.orderService.deleteOrder(order.id).subscribe({
        next: () => {
          this.router.navigate(['/supplier-orders']);
        },
        error: () => {
          this.notification.error("error", "Failed to delete order");
        }
      });
    }
  }

  calculateTotal(): number {
    const order = this.order();
    return order ? this.orderService.calculateOrderTotal(order) : 0;
  }

  canMarkAsReceived(): boolean {
    const order = this.order();
    return order ? this.orderService.canMarkAsReceived(order) : false;
  }

  canCancel(): boolean {
    const order = this.order();
    return order ? this.orderService.canCancel(order) : false;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
