import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductRequest } from '../../models/product.model';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-form',
    imports: [ReactiveFormsModule, PageHeaderComponent, CommonModule],
    templateUrl: './product-form.html',
    styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
    private fb: FormBuilder = inject(FormBuilder);
    private productService: ProductService = inject(ProductService);
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private notificationService: NotificationService = inject(NotificationService);

    productForm: FormGroup;
    isEditMode = signal<boolean>(false);
    productId = signal<number | null>(null);
    isLoading = signal<boolean>(false);

    constructor() {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(1)]],
            productionTime: [0, [Validators.required, Validators.min(0)]],
            cost: [0, [Validators.required, Validators.min(0)]],
            stock: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.productId.set(+id);
            this.loadProduct(+id);
        }
    }

    loadProduct(id: number): void {
        this.isLoading.set(true);
        this.productService.getProduct(id).subscribe({
            next: (product) => {
                this.productForm.patchValue({
                    name: product.name,
                    productionTime: product.productionTime,
                    cost: product.cost,
                    stock: 0 // Stock is not returned in the response DTO, using default
                });
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading product:', error);
                this.notificationService.error('Failed to load product', error.message || 'An error occurred');
                this.isLoading.set(false);
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.valid) {
            this.isLoading.set(true);
            const productData: ProductRequest = this.productForm.value;

            const operation = this.isEditMode()
                ? this.productService.updateProduct(this.productId()!, productData)
                : this.productService.createProduct(productData);

            operation.subscribe({
                next: () => {
                    this.notificationService.success(
                        this.isEditMode() ? 'Product updated' : 'Product created',
                        this.isEditMode() ? 'Product updated successfully' : 'Product created successfully'
                    );
                    this.router.navigate(['/production/products']);
                },
                error: (error) => {
                    console.error('Error saving product:', error);
                    this.notificationService.error('Failed to save product', error.message || 'An error occurred');
                    this.isLoading.set(false);
                }
            });
        } else {
            this.markFormGroupTouched(this.productForm);
        }
    }

    onCancel(): void {
        this.router.navigate(['/production/products']);
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    get name() { return this.productForm.get('name'); }
    get productionTime() { return this.productForm.get('productionTime'); }
    get cost() { return this.productForm.get('cost'); }
    get stock() { return this.productForm.get('stock'); }
}
