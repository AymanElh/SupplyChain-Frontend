import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { SupplierService } from '../../../suppliers/services/supplier.service';
import { RawMaterialService } from '../../../raw-materials/services/raw-material-service';
import { SupplierOrderService } from '../../services/supplier-order-service';
import { Router } from '@angular/router';
import { OrderStatus } from '../../models/supplier-order-model';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-order-form-component',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './order-form-component.html',
  styleUrl: './order-form-component.css',
})
export class OrderFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private orderService = inject(SupplierOrderService);
  private supplierService = inject(SupplierService);
  private materialService = inject(RawMaterialService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  orderForm!: FormGroup;
  isSubmitting = signal<boolean>(false);

  suppliers = this.supplierService.suppliers;
  materials = this.materialService.materials;

  orderTotal = signal<number>(0);

  isLoadingData = signal<boolean>(true);


  ngOnInit(): void {
    this.initForm();
    this.loadRequiredData();
  }

  private initForm() {
    this.orderForm = this.fb.group({
      supplierId: ['', [Validators.required]],
      orderDate: ['', [Validators.required]],
      items: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    this.addItem();

    this.orderForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    })
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      materialId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    })
  }

  private loadRequiredData(): void {
    this.isLoadingData.set(true);
    Promise.all([
      this.supplierService.loadSuppliers(0, 100).toPromise(),
      this.materialService.loadMaterials(0, 100).toPromise()
    ]).then(() => {
      this.isLoadingData.set(false);
    }).catch((err => {
      console.error("Error loading data ...", err);
      this.isLoadingData.set(false);
    }))
  }

  onSubmit(): void {
    this.markFormGroupTouched(this.orderForm);

    if (this.orderForm.invalid) {
      console.log("Form invalid: ", this.orderForm.errors);
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.orderForm.value;

    const orderData = {
      supplierId: Number(formValue.supplierId),
      orderDate: formValue.orderDate,
      status: OrderStatus.WAITING,
      items: formValue.items.map((item: any) => ({
        materialId: Number(item.materialId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      }))
    }
    console.log("Submitting form data: ", orderData);

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log("Order created successfully ", response);
        this.isSubmitting.set(false);
        this.notification.success("Order Created", "Order created successfully");
        this.router.navigate(['/supply/orders']);
      },
      error: (error) => {
        console.error("Error creating the order: ", error);
        this.isSubmitting.set(false);
        
        // Extract error message from HttpErrorResponse
        const errorMessage = error.error?.message || error.message || 'Failed to create order';
        this.notification.error("Order Creation Failed", errorMessage);
      }
    })
  }

  addItem() {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateSubTotal(index: number): number {
    const item = this.items.at(index);
    const quantity = item?.get('quantity')?.value || 0;
    const unitPrice = item?.get('unitPrice')?.value || 0;
    return quantity * unitPrice;
  }

  hasItems(): boolean {
    return this.items.length > 0;
  }

  calculateTotal(): void {
    let total = 0;

    for (let i = 0; i < this.items.length; i++) {
      total += this.calculateSubTotal(i);
    }

    this.orderTotal.set(total);
  }

  getSupplierName(id: number): string {
    const supplier = this.suppliers().find(s => s.id == id);
    return supplier ? supplier.name : '';
  }

  getUniqueItemsCount(): number {
    return this.items.controls.length;
  }

  getTotalQuantity(): number {
    return this.items.controls.reduce((total, item) => total + (item.get('quantity')?.value || 0), 0);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isItemFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.items.at(index).get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));

  }

  getFieldError(fieldName: string): string {
    const field = this.orderForm.get(fieldName);
    if (!field || !field.errors) return "";

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
    if (field.errors['minlength']) return 'Add at least one item to the order';

    return "Invalid field";
  }

  getItemFieldError(index: number, fieldName: string): string {
    const field = this.items.at(index).get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['min']) return `Min: ${field.errors['min'].min}`;

    return 'Invalid';
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
      Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
