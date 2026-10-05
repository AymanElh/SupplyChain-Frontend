import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { AddressRequest, CustomerRequest } from '../../models/customer.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './customer-form.html'
})
export class CustomerForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private notification = inject(NotificationService);

  customerForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  private editingId: number | null = null;

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      addresses: this.fb.array([])
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editingId = +id;
      this.loadCustomer(+id);
    } else {
      this.addAddress();
    }
  }

  get addresses(): FormArray {
    return this.customerForm.get('addresses') as FormArray;
  }

  createAddressGroup(address?: AddressRequest): FormGroup {
    return this.fb.group({
      country: [address?.country || '', [Validators.required]],
      postalCode: [address?.postalCode || '', [Validators.required]],
      region: [address?.region || '', [Validators.required]],
      city: [address?.city || '', [Validators.required]],
      street: [address?.street || '', [Validators.required]]
    });
  }

  addAddress(): void {
    this.addresses.push(this.createAddressGroup());
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  private loadCustomer(id: number): void {
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          name: customer.name,
          phone: customer.phone,
          email: customer.email
        });
        this.addresses.clear();
        (customer.addresses || []).forEach(address =>
          this.addresses.push(this.createAddressGroup(address))
        );
        if (this.addresses.length === 0) {
          this.addAddress();
        }
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.router.navigate(['/delivery/customers']);
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.notification.error('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting.set(true);
    const payload: CustomerRequest = this.customerForm.value;
    const request = this.isEditMode() && this.editingId !== null
      ? this.customerService.updateCustomer(this.editingId, payload)
      : this.customerService.createCustomer(payload);

    request.subscribe({
      next: (customer) => {
        this.notification.success(
          'Success',
          this.isEditMode() ? 'Customer updated successfully' : `Customer ${customer.name} created`
        );
        this.isSubmitting.set(false);
        this.router.navigate(['/delivery/customers', customer.id]);
      },
      error: (error) => {
        console.error('Error saving customer:', error);
        this.notification.error('Error', ErrorHandler.getCompleteErrorMessage(error));
        this.isSubmitting.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('email')) return 'Enter a valid email address';
    return '';
  }

  isAddressFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.addresses.at(index)?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
