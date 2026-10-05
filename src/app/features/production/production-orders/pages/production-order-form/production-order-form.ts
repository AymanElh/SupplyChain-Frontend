import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductionOrderService } from '../../services/production-order.service';
import { ProductService } from '../../../products/services/product.service';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-production-order-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './production-order-form.html'
})
export class ProductionOrderForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderService = inject(ProductionOrderService);
  private productService = inject(ProductService);
  private notification = inject(NotificationService);

  orderForm!: FormGroup;
  isSubmitting = signal<boolean>(false);
  isLoadingProducts = signal<boolean>(false);

  products = this.productService.products;
  priorities = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      productId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      startDate: [null]
    });
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoadingProducts.set(true);
    this.productService.loadProducts(0, 100).subscribe({
      next: () => this.isLoadingProducts.set(false),
      error: () => this.isLoadingProducts.set(false)
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.notification.error('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting.set(true);
    const { productId, quantity, priority, startDate } = this.orderForm.value;

    this.orderService.createOrder({
      productId,
      quantity,
      priority,
      ...(startDate ? { startDate: new Date(startDate).toISOString() } : {})
    }).subscribe({
      next: (order) => {
        this.notification.success('Success', `Production order #${order.id} created in waiting queue`);
        this.isSubmitting.set(false);
        this.router.navigate(['/production/orders', order.id]);
      },
      error: (error) => {
        console.error('Error creating production order:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isSubmitting.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.orderForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('min')) return 'Must be at least 1';
    if (field?.hasError('max')) return 'Must be at most 5';
    return '';
  }
}
