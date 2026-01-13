import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SupplierService} from '../../services/supplier.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-supplier-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css',
})
export class SupplierForm implements OnInit{
  private formBuilder = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
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
      error: () => {
        this.router.navigate(['/suppliers']);
      }
    })
  }

  onSubmit() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const supplierData = this.supplierForm.value;

    const operation = this.isEditMode ? this.supplierService.updateSupplier(this.supplierId!, supplierData) : this.supplierService.createSupplier(supplierData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/suppliers']);
      },
      error: () => {
        this.isSubmitting = false;
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
