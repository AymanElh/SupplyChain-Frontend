import { computed, inject, Injectable, signal } from '@angular/core';
import { RawMaterialApiService } from './raw-material-api-service';
import { RawMaterialRequest, RawMaterialResponse } from '../models/raw-material.model';
import { Observable, tap } from 'rxjs';
import { PageResponse } from '../../../../core/models/page-response.model';


@Injectable({
  providedIn: 'root',
})
export class RawMaterialService {
  
  private api: RawMaterialApiService = inject(RawMaterialApiService);

  materials = signal<RawMaterialResponse[]>([]);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(false);

  criticalMaterials = computed(() => {
    return this.materials().filter(m => m.isCritical)
  })

  lowStockMaterials = computed(() => {
    return this.materials().filter(m => m.stock <= m.stockMin)
  })

  totalInventoryValue = computed(() => {
    return this.materials().reduce((sum, m) => sum + (m.stock * m.unitCost), 0);
  })

  loadMaterials(page: number = 0, size: number = 10): Observable<PageResponse<RawMaterialResponse>> {
    this.isLoading.set(true);
    return this.api.getAll(page, size).pipe(
      tap({
        next: (resp) => {
          this.materials.set(resp.content);
          this.currentPage.set(resp.number);
          this.totalPages.set(resp.totalPages);
          this.totalElements.set(resp.totalElements);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      })
    )
  }

  getMaterial(id: number): Observable<RawMaterialResponse> {
    return this.api.getById(id);
  }

  creaetMaterial(material: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.api.create(material).pipe(
      tap({
        next: (resp) => {
          this.materials.update((prev) => [...prev, resp]);
          // show notification
        }
      })
    )
  }

  updateMaterial(id: number, material: RawMaterialRequest): Observable<RawMaterialResponse> {
    return this.api.update(id, material).pipe(
      tap({
        next: (resp) => {
          this.materials.update((prev) => prev.map((m) => m.id === id ? resp : m));
          // show notification
        }
      })
    )
  }

  deleteMaterial(id: number): Observable<void> {
    return this.api.delete(id).pipe(
      tap({
        next: () => {
          this.materials.update(curr => curr.filter(m => m.id !== id));
          // show notification
        }
      })
    )
  }
}
