import { Injectable, signal } from '@angular/core';
import { ProductApiService } from './product-api.service';
import { Observable, tap } from 'rxjs';
import { ProductRequest, ProductResponse } from '../models/product.model';

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

    loadProducts(page: number = 0, size: number = 10, sortBy: string = 'id') {
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
}
