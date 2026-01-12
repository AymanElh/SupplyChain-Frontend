import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RawMaterialService} from '../../services/raw-material-service';
import {SupplierService} from '../../../suppliers/services/supplier.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-material-form-component',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './material-form-component.html',
  styleUrl: './material-form-component.css',
})
export class MaterialFormComponent implements OnInit{
  private fb: FormBuilder = inject(FormBuilder);
  private materialService = inject(RawMaterialService);
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  materialForm!: FormGroup
  isEditMode = false;
  isSubmitting = false;
  materialId!: number;

  suppliers = this.supplierService.suppliers;

  ngOnInit() {
    this.loadSuppliers();
    this.initForm();
  }

  private initForm(): void {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      stockMin: ['', [Validators.required, Validators.min(0)]],
      unitCost: ['', [Validators.required, Validators.min(0)]],
      unit: ['', [Validators.required]],
      supplierIds: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  private loadSuppliers() {
    this.supplierService.loadSuppliers(0, 100).subscribe();
  }
  
  onSubmit() {
    if (this.materialForm.invalid) {
      console.log("Supplier ids: " + this.materialForm.get('suppliersIds')?.value);
      return;
    }

    this.isSubmitting = true;
    const materialData = this.materialForm.value;

    const operation = this.isEditMode ?
      this.materialService.updateMaterial(this.materialId!, materialData)
      : this.materialService.creaetMaterial(materialData);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/materials']);
      }
    })

  }

  isFieldInvalid(fieldName: string) {
    const field = this.materialForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(filedName: string): string {
    const field = this.materialForm.get(filedName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${filedName} is required`;
    if (field.errors['minlength']) return `${filedName} is too short`;
    if (field.errors['email']) return 'Invalid email format';
    if (field.errors['pattern']) return 'Invalid format';
    if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
    if (field.errors['max']) return `Maximum value is ${field.errors['max'].max}`;

    return 'Invalid field';
  }

  onSupplierChange(supplierId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentIds = this.materialForm.get('supplierIds')?.value || [];

    if (checkbox.checked) {
      this.materialForm.patchValue({
        supplierIds: [...currentIds, supplierId]
      });
    } else {
      this.materialForm.patchValue({
        supplierIds: currentIds.filter((id: number) => id !== supplierId)
      });
    }
    console.log("Supplier ids: " + currentIds);
  }

  isSupplierSelected(supplierId: number): boolean {
    const selectedIds = this.materialForm.get('supplierIds')?.value || [];
    return selectedIds.includes(supplierId);
  }
}
