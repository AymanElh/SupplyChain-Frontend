import { Component, inject, signal } from '@angular/core';
import { RawMaterialService } from '../../services/raw-material-service';
import { DecimalPipe } from '@angular/common';
import { RawMaterialResponse } from '../../models/raw-material.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-material-list-component',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './material-list-component.html',
  styleUrl: './material-list-component.css',
})
export class MaterialListComponent {

  private rawMaterialService = inject(RawMaterialService);

  filterMode = signal<'all' | 'critical' | 'low'>('all');
  pageSize = signal<number>(10);

  materials = this.rawMaterialService.materials;
  isLoading = this.rawMaterialService.isLoading;
  currentPage = this.rawMaterialService.currentPage;
  totalPages = this.rawMaterialService.totalPages;
  criticalCount = this.rawMaterialService.criticalMaterials;
  lowStockCount = this.rawMaterialService.lowStockMaterials;
  totalValue = this.rawMaterialService.totalInventoryValue;

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.rawMaterialService.loadMaterials(
      this.currentPage(),
      this.pageSize()
    ).subscribe();
  }

  getFilteredMaterials(): RawMaterialResponse[] {
    const mode = this.filterMode();
    const allMaterials = this.materials();

    switch (mode) {
      case 'critical':
        return allMaterials.filter(m => m.isCritical);
      case 'low':
        return allMaterials.filter(m => m.stock <= m.stockMin);
      default:
        return allMaterials;
    }
  }

  setFilter(mode: 'all' | 'critical' | 'low'): void {
    this.filterMode.set(mode);
  }

  onDelete(material: RawMaterialResponse) {
    if (confirm(`Delete material ${material.name}?`)) {
      this.rawMaterialService.deleteMaterial(material.id).subscribe({
        next: () => this.loadMaterials()
      })
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.rawMaterialService.loadMaterials(
        this.currentPage() + 1,
        this.pageSize()
      ).subscribe();
    }
  }

  previousPage() {
    if (this.currentPage() > 0) {
      this.rawMaterialService.loadMaterials(
        this.currentPage() - 1,
        this.pageSize()
      ).subscribe();
    }
  }
}
