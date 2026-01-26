  import { Injectable } from '@angular/core';
  import { HttpClient, HttpParams } from '@angular/common/http';
  import { environment } from '../../../../../environments/environment';
  import { BomItem, BomRequest, ProductBom, ProductDetailResponse, ProductRequest, ProductResponse } from '../models/product.model';
  import { Observable } from 'rxjs';
  import { PageResponse } from '../../../../core/models/page-response.model';

  @Injectable({
      providedIn: 'root',
  })
  export class ProductApiService {
      private apiUrl = `${environment.apiUrl}/products`;

      constructor(
          private http: HttpClient
      ) {
      }


      /**
       * Get all products
       * @param page
       * @param size
       * @param sortBy
       */
      getAll(page: number = 0, size: number = 10, sortBy: string = 'id'): Observable<PageResponse<ProductResponse>> {
          const params = new HttpParams()
              .set('page', page.toString())
              .set('size', size.toString())
              .set('sortBy', sortBy);

          return this.http.get<PageResponse<ProductResponse>>(this.apiUrl, { params });
      }


      /**
       * Get Product by id
       * @param id
       */
      getById(id: number): Observable<ProductDetailResponse> {
          return this.http.get<ProductDetailResponse>(`${this.apiUrl}/${id}`);
      }

      /**
       * Create a new product
       * @param product
       */
      create(product: ProductRequest): Observable<ProductResponse> {
          return this.http.post<ProductResponse>(this.apiUrl, product);
      }

      /**
       * Update a product
       * @param id
       * @param product
       */
      update(id: number, product: ProductRequest): Observable<ProductResponse> {
          return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product);
      }


      /**
       * Delete a product by id
       * @param id
       */
      delete(id: number): Observable<void> {
          return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }

      /**
       * Get Bill of material for a product
       * GET /products/{productId}/bom
       * Returns an array of BillOfMaterialResponseDTO
       * @param productId
       * @returns
       */
      getBom(productId: number): Observable<BomItem[]> {
          return this.http.get<BomItem[]>(`${this.apiUrl}/${productId}/bills`);
      }

      /**
       * Save BOM for a product
       * POST /products/{productId}/bom
       * @param productId
       * @param bom
       * @returns
       */
      saveBom(productId: number, bom: BomRequest): Observable<ProductBom> {
          return this.http.post<ProductBom>(`${this.apiUrl}/${productId}/bills`, bom);
      }

      /**
       * Delete BOM for a product
       * DELETE /products/{productId}/bom
       * @param productId
       * @returns
       */
      deleteBom(productId: number): Observable<void> {
          return this.http.delete<void>(`${this.apiUrl}/${productId}/bills`);
      }
  }
