import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/product.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-detail',
    imports: [PageHeaderComponent, CommonModule, RouterLink],
    templateUrl: './product-detail.html',
    styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
    private route: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private productService: ProductService = inject(ProductService);

    product = signal<ProductResponse | null>(null);
    isLoading = signal<boolean>(true);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProduct(+id);
        }
    }

    loadProduct(id: number): void {
        this.isLoading.set(true);
        this.productService.getProduct(id).subscribe({
            next: (product) => {
                this.product.set(product);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading product:', error);
                this.isLoading.set(false);
                this.router.navigate(['/production/products']);
            }
        });
    }

    onEdit(): void {
        if (this.product()) {
            this.router.navigate(['/production/products', this.product()!.id, 'edit']);
        }
    }

    onDelete(): void {
        if (this.product() && confirm(`Are you sure you want to delete ${this.product()!.name}?`)) {
            this.productService.deleteProduct(this.product()!.id).subscribe({
                next: () => {
                    this.router.navigate(['/production/products']);
                },
                error: (error) => {
                    console.error('Error deleting product:', error);
                }
            });
        }
    }
}
