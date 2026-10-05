import {Component, inject, OnInit, signal} from '@angular/core';
import {SupplierService} from '../../services/supplier.service';
import {SupplierApiService} from '../../services/supplier-api.service';
import {SupplierResponse} from '../../models/supplier.model';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ErrorHandler } from '../../../../../core/utils/error-handler';

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, FormsModule, PageHeaderComponent, DataTableComponent],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList implements OnInit {

  private supplierService: SupplierService = inject(SupplierService);
  private supplierApi: SupplierApiService = inject(SupplierApiService);
  private notification = inject(NotificationService);
  private router: Router = inject(Router);

  searchQuery = signal<string>('');
  isSearching = signal<boolean>(false);
  pageSize = signal<number>(10);
  sortBy = signal<string>('id');

  suppliers = this.supplierService.suppliers;
  isLoading = this.supplierService.isLoading;
  currentPage = this.supplierService.currentPage;
  totalPages = this.supplierService.totalPages;

  // Table columns configuration
  columns: TableColumn[] = [
    { key: 'id', label: '#', type: 'number', width: '80px' },
    { key: 'name', label: 'Supplier Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'rating', label: 'Rating', type: 'number', align: 'center', width: '100px' },
    { key: 'leadTime', label: 'Lead Time (days)', type: 'number', align: 'right', width: '150px' }
  ];

  // Table actions configuration
  actions: TableAction[] = [
    {
      label: 'View',
      color: 'blue',
      action: (supplier: SupplierResponse) => this.router.navigate(['/supply/suppliers', supplier.id])
    },
    {
      label: 'Edit',
      color: 'yellow',
      action: (supplier: SupplierResponse) => this.router.navigate(['/supply/suppliers', supplier.id, 'edit'])
    },
    {
      label: 'Delete',
      color: 'red',
      action: (supplier: SupplierResponse) => this.onDelete(supplier)
    }
  ];

  // Track by function for performance
  trackBySupplier = (supplier: SupplierResponse) => supplier.id;

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.loadSuppliers(
      this.currentPage(),
      this.pageSize(),
      this.sortBy()
    ).subscribe();

    console.log("Data fetched: ", this.suppliers);
  }

  onDelete(supplier: SupplierResponse) {    if (confirm(`Are you sure you want to delete this supplier ${supplier.name}?`)) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.loadSuppliers();
        }
      });
    }
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (!query) {
      this.clearSearch();
      return;
    }
    this.isSearching.set(true);
    this.supplierApi.searchByName(query).subscribe({
      next: (supplier) => {
        this.supplierService.suppliers.set(supplier ? [supplier] : []);
        this.isSearching.set(false);
      },
      error: (error) => {
        console.error('Supplier search failed:', error);
        this.notification.error('No match', ErrorHandler.getCompleteErrorMessage(error));
        this.supplierService.suppliers.set([]);
        this.isSearching.set(false);
      }
    });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.loadSuppliers();
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
