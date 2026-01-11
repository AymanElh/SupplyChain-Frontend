import {Component, inject, OnInit, signal} from '@angular/core';
import {SupplierService} from '../../services/supplier.service';
import {SupplierResponse} from '../../models/supplier.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  imports: [
    RouterLink
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList implements OnInit {

  private supplierService: SupplierService = inject(SupplierService);

  searchQuery = signal<string>('');
  pageSize = signal<number>(10);

  suppliers = this.supplierService.suppliers;
  isLoading = this.supplierService.isLoading;
  currentPage = this.supplierService.currentPage;
  totalPages = this.supplierService.totalPages;

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.loadSuppliers(
      this.currentPage(),
      this.pageSize()
    ).subscribe();

    console.log("Data fetched: ", this.suppliers);
  }

  onDelete(supplier: SupplierResponse) {
    if (confirm(`Are you sure you want to delete this supplier ${supplier.name}?`)) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.loadSuppliers();
        }
      });
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.supplierService.loadSuppliers(
        this.currentPage() + 1,
        this.pageSize()
      ).subscribe();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.supplierService.loadSuppliers(
        this.currentPage() - 1,
        this.pageSize()
      ).subscribe();
    }
  }

  goToPage(page: number): void {
    this.supplierService.loadSuppliers(page, this.pageSize()).subscribe();
  }
}
