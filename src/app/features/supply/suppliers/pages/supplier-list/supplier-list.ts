import {Component, inject, OnInit, signal} from '@angular/core';
import {SupplierService} from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  imports: [],
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
}
