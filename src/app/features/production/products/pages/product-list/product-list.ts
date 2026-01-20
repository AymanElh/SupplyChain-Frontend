import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/product.model';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../../../shared/components/data-table/data-table.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-list',
    imports: [PageHeaderComponent, DataTableComponent, CommonModule],
    templateUrl: './product-list.html',
    styleUrl: './product-list.css',
})
export class ProductList implements OnInit {

    private productService: ProductService = inject(ProductService);
    private router: Router = inject(Router);

    searchQuery = signal<string>('');
    pageSize = signal<number>(10);
    sortBy = signal<string>('id');

    products = this.productService.products;
    isLoading = this.productService.isLoading;
    currentPage = this.productService.currentPage;
    totalPages = this.productService.totalPages;

    // Table columns configuration
    columns: TableColumn[] = [
        { key: 'id', label: '#', type: 'number', width: '80px' },
        { key: 'name', label: 'Product Name', type: 'text' },
        { key: 'productionTime', label: 'Production Time (h)', type: 'number', align: 'center', width: '180px' },
        { key: 'cost', label: 'Cost', type: 'number', align: 'right', width: '120px' },
        { key: 'materialCost', label: 'Material Cost', type: 'number', align: 'right', width: '140px' },
        { key: 'profitMargin', label: 'Profit Margin', type: 'number', align: 'right', width: '140px' }
    ];

    // Table actions configuration
    actions: TableAction[] = [
        {
            label: 'View',
            color: 'blue',
            action: (product: ProductResponse) => this.router.navigate(['/production/products', product.id])
        },
        {
            label: 'Edit',
            color: 'yellow',
            action: (product: ProductResponse) => this.router.navigate(['/production/products', product.id, 'edit'])
        },
        {
            label: 'Delete',
            color: 'red',
            action: (product: ProductResponse) => this.onDelete(product)
        }
    ];

    // Track by function for performance
    trackByProduct = (product: ProductResponse) => product.id;

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.loadProducts(
            this.currentPage(),
            this.pageSize(),
            this.sortBy()
        ).subscribe();

        console.log("Data fetched: ", this.products);
    }

    onDelete(product: ProductResponse) {
        if (confirm(`Are you sure you want to delete this product ${product.name}?`)) {
            this.productService.deleteProduct(product.id).subscribe({
                next: () => {
                    this.loadProducts();
                }
            });
        }
    }

    nextPage() {
        if (this.currentPage() < this.totalPages() - 1) {
            this.productService.loadProducts(
                this.currentPage() + 1,
                this.pageSize()
            ).subscribe();
        }
    }

    previousPage(): void {
        if (this.currentPage() > 0) {
            this.productService.loadProducts(
                this.currentPage() - 1,
                this.pageSize()
            ).subscribe();
        }
    }

    goToPage(page: number): void {
        this.productService.loadProducts(page, this.pageSize()).subscribe();
    }
}
