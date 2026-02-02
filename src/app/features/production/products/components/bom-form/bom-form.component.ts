import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RawMaterialService } from '../../../../supply/raw-materials/services/raw-material-service';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { BomRequest } from '../../models/product.model';
import { MaterialItemsTableComponent } from '../../../../../shared/components/material-items-table/material-items-table.component';

@Component({
  selector: 'app-bom-form',
  standalone: true,
  imports: [CommonModule, ɵInternalFormsSharedModule, ReactiveFormsModule, MaterialItemsTableComponent],
  templateUrl: './bom-form.component.html',
  styleUrl: './bom-form.component.css',
})
export class BomFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private materialService = inject(RawMaterialService);
  private productService = inject(ProductService);
  private notification = inject(NotificationService);

  @Input() productId!: number;
  @Input() existingMaterialIds: number[] = [];
  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  bomForm!: FormGroup;
  isSubmitting = signal<boolean>(false);
  materials = this.materialService.materials;
  totalCost = signal<number>(0);
  isLoadingData = signal<boolean>(true);

  ngOnInit(): void {
    this.initForm();
    this.loadMaterials();
  }

  private initForm() {
    this.bomForm = this.fb.group({
      items: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    // Add first item by default
    this.addItem();
  }

  get items(): FormArray {
    return this.bomForm.get('items') as FormArray;
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      rawMaterialId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  private loadMaterials(): void {
    this.isLoadingData.set(true);
    this.materialService.loadMaterials(0, 100).subscribe({
      next: () => {
        this.isLoadingData.set(false);
        console.log(this.materials());
      },
      error: (err) => {
        console.error('Error loading materials:', err);
        this.notification.error('Error', 'Failed to load materials');
        this.isLoadingData.set(false);
      }
    });
  }

  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onTotalChanged(total: number): void {
    this.totalCost.set(total);
  }



  onSubmit(): void {
    if (this.bomForm.invalid) {
      this.bomForm.markAllAsTouched();
      this.notification.error('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    this.isSubmitting.set(true);

    const bomRequest: BomRequest = {
      items: this.bomForm.value.items
    };

    this.productService.saveBom(this.productId, bomRequest).subscribe({
      next: () => {
        this.notification.success('Success', 'Bill of Materials created successfully');
        this.isSubmitting.set(false);
        this.submitted.emit();
      },
      error: (error) => {
        console.error('Error creating BOM:', error);
        const errorMsg = error.error?.message || error.message || 'Failed to create BOM';
        this.notification.error('Error', errorMsg);
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  // Validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bomForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.bomForm.get(fieldName);
    if (field?.hasError('required')) return `${fieldName} is required`;
    if (field?.hasError('minlength')) return `At least 1 item is required`;
    return '';
  }

  isItemFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.items.at(index)?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getItemFieldError(index: number, fieldName: string): string {
    const field = this.items.at(index)?.get(fieldName);
    if (field?.hasError('required')) return 'Required';
    if (field?.hasError('min')) return 'Must be at least 1';
    return '';
  }
}
