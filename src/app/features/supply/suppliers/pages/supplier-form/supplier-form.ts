import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-supplier-form',
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css',
})
export class SupplierForm implements OnInit{
  private formBuilder = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  supplierForm!: FormGroup;
  isEditMode = false;
  supplierId?: number;
  isSubmitting = false;

  ngOnInit() {
    this.initForm();
    this.checkIsEditMode();
  }

  private initForm() {
    this.supplierForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.email]],
      rating: ['', [Validators.min(0), Validators.max(5)]],
      leadTime: ['', [Validators.min(0)]]
    });
  }

  private checkIsEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.supplierId = +id;
      this.loadSupplier(this.supplierId);
    }
  }

  private loadSupplier(id: number) {
    this.supplierService.getSupplier(id).subscribe({
      next: (supplier) => {
        this.supplierForm.patchValue(supplier);
      },
      error: (error) => {
        const errorMessage = error.error?.message || error.message || 'Failed to load supplier';
        this.notificationService.error('Load Failed', errorMessage);
        this.router.navigate(['/supply/suppliers']);
      }
    })
  }

  onSubmit() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      this.notificationService.warning('Invalid Form', 'Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting = true;
    const supplierData = this.supplierForm.value;

    const operation = this.isEditMode ? this.supplierService.updateSupplier(this.supplierId!, supplierData) : this.supplierService.createSupplier(supplierData);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        const action = this.isEditMode ? 'updated' : 'created';
        this.notificationService.success('Success', `Supplier ${action} successfully`);
        this.router.navigate(['/supply/suppliers']);
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error.error?.message || error.message || 'Failed to save supplier';
        this.notificationService.error('Save Failed', errorMessage);
      }
    })
  }

    isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(filedName: string): string {
    const field = this.supplierForm.get(filedName);
    if (!field || !field.errors) return '';
    
    if (field.errors['required']) return `${filedName} is required`;
    if (field.errors['minlength']) return `${filedName} is too short`;
    if (field.errors['email']) return 'Invalid email format';
    if (field.errors['pattern']) return 'Invalid format';
    if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
    if (field.errors['max']) return `Maximum value is ${field.errors['max'].max}`;

    return 'Invalid field';
  }
}
