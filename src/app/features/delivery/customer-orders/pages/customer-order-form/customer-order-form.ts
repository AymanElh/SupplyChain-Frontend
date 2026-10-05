import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerOrderService } from '../../services/customer-order.service';
import { CustomerService } from '../../../customers/services/customer.service';
import { ProductService } from '../../../../production/products/services/product.service';
import { CustomerOrderItemRequest, CustomerOrderRequest } from '../../models/customer-order.model';
import { AddressResponse, CustomerResponse } from '../../../customers/models/customer.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-customer-order-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './customer-order-form.html'
})
export class CustomerOrderForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderService = inject(CustomerOrderService);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private notification = inject(NotificationService);

  orderForm!: FormGroup;
  isSubmitting = signal<boolean>(false);

  customers = signal<CustomerResponse[]>([]);
  products = this.productService.products;

  selectedCustomer = signal<CustomerResponse | null>(null);
  addresses = computed<AddressResponse[]>(() => this.selectedCustomer()?.addresses || []);

  orderTotal = computed(() => {
    const items = this.items.controls.map(group => group.value);
    return items.reduce((sum: number, row: { quantity: number; unitPrice: number }) =>
      sum + (Number(row.quantity) || 0) * (Number(row.unitPrice) || 0), 0);
  });

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      customerId: [null, [Validators.required]],
      addressId: [null, [Validators.required]],
      items: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
    this.addItem();
    this.loadCustomers();
    this.productService.loadProducts(0, 100).subscribe();
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  private loadCustomers(): void {
    this.customerService.loadCustomers(0, 100).subscribe({
      next: () => this.customers.set(this.customerService.customers())
    });
  }

  onCustomerChange(customerId: number): void {
    const found = this.customers().find(c => c.id === +customerId) || null;
    this.selectedCustomer.set(found);
    this.orderForm.get('addressId')?.setValue(null);
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      productId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onProductChange(index: number, productId: number): void {
    const product = this.products().find(p => p.id === +productId);
    if (product) {
      this.items.at(index).get('unitPrice')?.setValue(product.cost);
    }
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.notification.error('Validation Error', 'Select a customer, address and at least one order line');
      return;
    }

    this.isSubmitting.set(true);
    const { customerId, addressId } = this.orderForm.value;
    const orderItems: CustomerOrderItemRequest[] = this.items.controls.map(group => ({
      productId: +group.value.productId,
      quantity: +group.value.quantity,
      unitPrice: +group.value.unitPrice
    }));

    const payload: CustomerOrderRequest = { customerId: +customerId, addressId: +addressId, orderItems };

    this.orderService.createOrder(payload).subscribe({
      next: (order) => {
        this.notification.success('Success', `Customer order #${order.id} created (pending)`);
        this.isSubmitting.set(false);
        this.router.navigate(['/delivery/customer-orders', order.id]);
      },
      error: (error) => {
        console.error('Error creating customer order:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isSubmitting.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
