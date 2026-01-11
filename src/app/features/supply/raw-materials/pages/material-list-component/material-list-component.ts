import { Component, inject, signal } from '@angular/core';
import { RawMaterialService } from '../../services/raw-material-service';

@Component({
  selector: 'app-material-list-component',
  imports: [],
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
}
