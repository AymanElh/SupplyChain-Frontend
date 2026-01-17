import { Component, inject, signal } from '@angular/core';
import { RawMaterialService } from '../../services/raw-material-service';
import { RawMaterialResponse } from '../../models/raw-material.model';
import { StatsCardComponent } from '../../../../../shared/components/stats-card/stats-card.component/stats-card.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTabsComponent } from '../../../../../shared/components/filter-tabs/filter-tabs.component';

@Component({
  selector: 'app-material-list-component',
  imports: [StatsCardComponent, PageHeaderComponent, FilterTabsComponent],
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

  // Filter tabs configuration
  get filterTabs() {
    return [
      {
        label: 'All Materials',
        value: 'all',
        count: this.materials().length,
        color: 'blue'
      },
      {
        label: 'Critical Materials',
        value: 'critical',
        count: this.criticalCount().length,
        color: 'red'
      },
      {
        label: 'Low Stock',
        value: 'low',
        count: this.lowStockCount().length,
        color: 'yellow'
      }
    ];
  }

  // Stats cards configuration
  get statsCards() {
    return [
      {
        title: 'Total Materials',
        value: this.materials().length.toString(),
        icon: '📦',
        iconBgColor: 'blue',
        trend: 'In inventory',
        trendColor: 'gray'
      },
      {
        title: 'Critical Materials',
        value: this.criticalCount().length.toString(),
        icon: '⚠️',
        iconBgColor: 'red',
        trend: 'Needs attention',
        trendColor: 'red'
      },
      {
        title: 'Low Stock',
        value: this.lowStockCount().length.toString(),
        icon: '📊',
        iconBgColor: 'yellow',
        trend: 'Low inventory',
        trendColor: 'yellow'
      },
      {
        title: 'Total Value',
        value: `$${this.totalValue().toLocaleString()}`,
        icon: '💰',
        iconBgColor: 'green',
        trend: 'Inventory value',
        trendColor: 'green'
      }
    ];
  }

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

  setFilter(mode: string): void {
    this.filterMode.set(mode as 'all' | 'critical' | 'low');
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
