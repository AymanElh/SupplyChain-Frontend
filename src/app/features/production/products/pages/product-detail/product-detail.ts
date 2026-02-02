import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import {ProductDetailResponse, ProductResponse} from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { BomFormComponent } from '../../components/bom-form/bom-form.component';

@Component({
    selector: 'app-product-detail',
    imports: [CommonModule, RouterLink, BomFormComponent],
    templateUrl: './product-detail.html',
    styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
    private route: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private productService: ProductService = inject(ProductService);

    product = signal<ProductDetailResponse | null>(null);
    isLoading = signal<boolean>(true);
    productId = signal<number>(0);
    showBomForm = signal<boolean>(false);
    isBomLoading = signal<boolean>(false);

    currentBom = this.productService.currentBom;

    hasBomData = computed(() => {
        const bom = this.currentBom();
        return bom !== null && bom.items && bom.items.length > 0;
    });

    existingMaterialIds = computed(() => {
        const bom = this.currentBom();
        return bom?.items?.map(item => item.materialId) || [];
    });

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
                if (product.hasBom) {
                    this.loadBom(product.id);
                } else {
                    this.productService.currentBom.set(null);
                }
            },
            error: (error) => {
                console.error('Error loading product:', error);
                this.isLoading.set(false);
                this.router.navigate(['/production/products']);
            }
        });
    }

    loadBom(productId: number): void {
        this.isBomLoading.set(true);
        this.productService.loadBom(productId).subscribe({
            next: () => {
                console.log("Bom loaded successfully: ", this.productService.currentBom());
                this.isBomLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading BOM:', error);
                this.isBomLoading.set(false);
            }
        })
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

    // BOM Management Methods
    onShowBomForm(): void {
        this.showBomForm.set(true);
    }

    onHideBomForm(): void {
        this.showBomForm.set(false);
    }

    onBomSubmitted(): void {
        this.showBomForm.set(false);
        // Reload BOM data
        const productId = this.product()?.id;
        if (productId) {
            this.loadBom(productId);
        }
        // Update product hasBom flag
        this.product.update(p => p ? { ...p, hasBom: true } : p);
    }
}
