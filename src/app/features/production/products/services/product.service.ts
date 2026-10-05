import { Injectable, signal } from '@angular/core';
import { ProductApiService } from './product-api.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { BomItem, BomItemRequest, ProductBom, ProductRequest, ProductResponse } from '../models/product.model';

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

    /**
     * Add several materials to a product's BOM.
     * The backend only exposes a per-item POST, so items are created
     * one by one and the BOM is reloaded afterwards.
     */
    saveBomItems(productId: number, items: BomItemRequest[]) {
        const creations = items.map(item => this.api.addBomItem(productId, item));
        return forkJoin(creations).pipe(
            tap({
                next: () => {
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

    updateBomItemQuantity(bomId: number, quantity: number) {
        return this.api.updateBomItemQuantity(bomId, quantity).pipe(
            tap({
                next: (updated) => {
                    this.currentBom.update(bom => {
                        if (!bom?.items) {
                            return bom;
                        }
                        const items = bom.items.map(item => item.id === bomId ? updated : item);
                        return {
                            ...bom,
                            items,
                            totalMaterialCost: items.reduce((sum, item) => sum + (item.totalCost || 0), 0)
                        };
                    });
                }
            })
        );
    }

    removeBomItem(bomId: number) {
        return this.api.removeBomItem(bomId).pipe(
            tap({
                next: () => {
                    this.currentBom.update(bom => {
                        if (!bom?.items) {
                            return bom;
                        }
                        const items = bom.items.filter(item => item.id !== bomId);
                        return {
                            ...bom,
                            items,
                            totalMaterialCost: items.reduce((sum, item) => sum + (item.totalCost || 0), 0)
                        };
                    });
                }
            })
        );
    }

    clearBom(productId: number) {
        const ids = (this.currentBom()?.items || [])
            .map(item => item.id)
            .filter((id): id is number => id !== undefined);
        if (ids.length === 0) {
            return forkJoin([]);
        }
        return forkJoin(ids.map(id => this.api.removeBomItem(id))).pipe(
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
