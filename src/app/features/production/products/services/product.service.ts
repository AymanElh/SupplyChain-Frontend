import { Injectable, signal } from '@angular/core';
import { ProductApiService } from './product-api.service';
import { Observable, tap } from 'rxjs';
import { BomItem, BomRequest, ProductBom, ProductRequest, ProductResponse } from '../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductService {

    constructor(
        private api: ProductApiService
    ) {
    }

    products = signal<ProductResponse[]>([]);
    currentPage = signal<number>(0);
    totalPages = signal<number>(0);
    totalElements = signal<number>(0);
    isLoading = signal<boolean>(false);

    currentProduct = signal<ProductResponse | null>(null);
    currentBom = signal<ProductBom | null>(null);

    loadProducts(page: number = 0, size: number = 10, sortBy: string = 'id') {
        console.log("Loading produts...");
        
        this.isLoading.set(true);
        return this.api.getAll(page, size, sortBy).pipe(
            tap({
                next: (response) => {
                    console.log(response);
                    this.products.set(response.content);
                    this.currentPage.set(response.number);
                    this.totalPages.set(response.totalPages);
                    this.totalElements.set(response.totalElements);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            })
        )
    }

    getProduct(id: number) {
        return this.api.getById(id);
    }

    createProduct(product: ProductRequest) {
        return this.api.create(product).pipe(
            tap({
                next: (newProduct) => {
                    this.products.update(curr => [...curr, newProduct]);
                }
            })
        );
    }

    updateProduct(id: number, product: ProductRequest): Observable<ProductResponse> {
        return this.api.update(id, product);
    }

    deleteProduct(id: number) {
        return this.api.delete(id).pipe(
            tap({
                next: () => {
                    this.products.update(current => current.filter(p => p.id !== id));
                }
            })
        );
    }

    loadBom(productId: number): Observable<BomItem[]> {
        return this.api.getBom(productId).pipe(
            tap({
                next: (bomItems) => {
                    // Calculate total material cost from the items
                    const totalMaterialCost = bomItems.reduce((sum, item) => sum + item.totalCost, 0);
                    const bom: ProductBom = {
                        productId,
                        items: bomItems,
                        totalMaterialCost
                    };
                    this.currentBom.set(bom);
                }
            })
        );
    }

    saveBom(productId: number, bom: BomRequest) {
        return this.api.saveBom(productId, bom).pipe(
            tap({
                next: (newBom) => {
                    this.currentBom.set(newBom);
                    this.currentProduct.update(product => {
                        if (product) {
                            return { ...product, hasBom: true };
                        }
                        return product;
                    })
                },
                error: (error) => {
                    console.log(error);
                }
            })
        );
    }

    deleteBom(productId: number) {
        return this.api.deleteBom(productId).pipe(
            tap({
                next: () => {
                    this.currentBom.set(null);
                    this.currentProduct.update(product => {
                        if (product) {
                            return { ...product, hasBom: false };
                        }
                        return product;
                    })
                }
            })
        );
    }
}
