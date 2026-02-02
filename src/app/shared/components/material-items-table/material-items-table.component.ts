import { Component, EventEmitter, Input, Output, signal, Signal } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

export interface MaterialItem {
  id: number;
  name: string;
  unit?: string;
  unitCost?: number;
}

@Component({
  selector: 'app-material-items-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ɵInternalFormsSharedModule],
  templateUrl: './material-items-table.component.html'
})
export class MaterialItemsTableComponent {
  // Configuration Inputs
  @Input() items!: FormArray;
  @Input() materials!: Signal<MaterialItem[]>;
  @Input() showUnitPriceInput: boolean = false; // true for orders, false for BOM
  @Input() addButtonText: string = '+ Add Item';
  @Input() totalLabel: string = 'Total';
  @Input() excludeMaterialIds: number[] = [];
  @Input() materialIdFieldName: string = 'materialId'; // 'materialId' for orders, 'rawMaterialId' for BOM
  
  // Outputs
  @Output() itemAdded = new EventEmitter<void>();
  @Output() itemRemoved = new EventEmitter<number>();
  @Output() totalChanged = new EventEmitter<number>();

  totalCost = signal<number>(0);

  // Add new item row
  onAddItem(): void {
    this.itemAdded.emit();
  }

  // Remove item row
  onRemoveItem(index: number): void {
    this.itemRemoved.emit(index);
    this.calculateTotal();
  }

  // Calculate subtotal for a row
  calculateSubTotal(index: number): number {
    const item = this.items.at(index);
    const materialId = item?.get(this.materialIdFieldName)?.value;
    const quantity = item?.get('quantity')?.value || 0;

    if (!materialId) return 0;

    if (this.showUnitPriceInput) {
      // For orders: use manual unitPrice
      const unitPrice = item?.get('unitPrice')?.value || 0;
      return quantity * unitPrice;
    } else {
      // For BOM: auto-calculate from material unitCost
      const material = this.materials().find(m => m.id === Number(materialId));
      const unitCost = material?.unitCost || 0;
      return quantity * unitCost;
    }
  }

  // Get material unit cost (for display)
  getMaterialUnitCost(index: number): number {
    const item = this.items.at(index);
    const materialId = item?.get(this.materialIdFieldName)?.value;

    if (!materialId) return 0;

    const material = this.materials().find(m => m.id === Number(materialId));
    return material?.unitCost || 0;
  }

  // Get material unit (kg, pcs, etc.)
  getMaterialUnit(index: number): string {
    const item = this.items.at(index);
    const materialId = item?.get(this.materialIdFieldName)?.value;

    if (!materialId) return '';

    const material = this.materials().find(m => m.id === Number(materialId));
    return material?.unit || '';
  }

  // Calculate total cost
  calculateTotal(): void {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.calculateSubTotal(i);
    }
    this.totalCost.set(total);
    this.totalChanged.emit(total);
  }

  // Check if material is already selected (to prevent duplicates)
  isMaterialExcluded(materialId: number): boolean {
    return this.excludeMaterialIds.includes(materialId);
  }

  // Check if there are items
  hasItems(): boolean {
    return this.items && this.items.length > 0;
  }

  // Validation helpers
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

  // Trigger recalculation on value changes
  ngAfterViewInit(): void {
    if (this.items) {
      this.items.valueChanges.subscribe(() => {
        this.calculateTotal();
      });
      // Initial calculation
      this.calculateTotal();
    }
  }
}
