import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from '../../../core/services/keycloak-service';
import { UserRole } from '../../../core/models/user-roles';
import { SupplierApiService } from '../../supply/suppliers/services/supplier-api.service';
import { RawMaterialApiService } from '../../supply/raw-materials/services/raw-material-api-service';
import { SupplierOrderApiService } from '../../supply/supplier-orders/services/supplier-order-api-service';
import { ProductionOrderApiService } from '../../production/production-orders/services/production-order-api.service';
import { CustomerOrderApiService } from '../../delivery/customer-orders/services/customer-order-api.service';
import { SupplierResponse } from '../../supply/suppliers/models/supplier.model';
import { RawMaterialResponse } from '../../supply/raw-materials/models/raw-material.model';
import { SupplierOrderResponse } from '../../supply/supplier-orders/models/supplier-order-model';
import { ProductionStatus } from '../../production/production-orders/models/production-order.model';

export interface DashboardStageSummary {
  status: ProductionStatus;
  count: number;
}

export interface DashboardSummary {
  live: boolean;
  totalSupplierOrders: number;
  inventoryValue: number;
  criticalMaterials: number;
  totalSuppliers: number;
  pendingCustomerOrders: number;
  productionStages: DashboardStageSummary[];
  suppliers: SupplierResponse[];
  materials: RawMaterialResponse[];
  recentOrders: SupplierOrderResponse[];
}

const STAGE_ORDER: ProductionStatus[] = ['IN_WAITING', 'IN_PRODUCTION', 'FINISHED', 'BLOCKED'];

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private keycloakService = inject(KeycloakService);

  constructor(
    private suppliers: SupplierApiService,
    private materials: RawMaterialApiService,
    private supplierOrders: SupplierOrderApiService,
    private productionOrders: ProductionOrderApiService,
    private customerOrders: CustomerOrderApiService
  ) {}

  loadSummary(): Observable<DashboardSummary> {
    const canReadSuppliers = this.keycloakService.hasAnyRole([
      UserRole.RESPONSABLE_ACHATS,
      UserRole.GESTIONNAIRE_APPROVISIONNEMENT
    ]);
    const canReadMaterials = this.keycloakService.hasRole(
      UserRole.GESTIONNAIRE_APPROVISIONNEMENT
    );
    const canReadOrders = this.keycloakService.hasAnyRole([
      UserRole.RESPONSABLE_ACHATS,
      UserRole.SUPERVISEUR_LOGISTIQUE
    ]);
    const canReadSales = this.keycloakService.hasAnyRole([
      UserRole.GESTIONNAIRE_COMMERCIAL,
      UserRole.SUPERVISEUR_LIVRAISONS
    ]);
    const canReadProduction = this.keycloakService.hasAnyRole([
      UserRole.CHEF_PRODUCTION,
      UserRole.SUPERVISEUR_PRODUCTION,
      UserRole.PLANIFICATEUR
    ]);

    return forkJoin({
      suppliers: canReadSuppliers ? this.suppliers.getAll(0, 3).pipe(catchError(() => of(null))) : of(null),
      materials: canReadMaterials ? this.materials.getAll(0, 100).pipe(catchError(() => of(null))) : of(null),
      orders: canReadOrders ? this.supplierOrders.getAll(0, 5, 'id').pipe(catchError(() => of(null))) : of(null),
      pendingSales: canReadSales ? this.customerOrders.getAll('PENDING', 0, 1).pipe(catchError(() => of(null))) : of(null),
      waiting: canReadProduction ? this.productionOrders.getByStatus('IN_WAITING', 0, 1).pipe(catchError(() => of(null))) : of(null),
      inProduction: canReadProduction ? this.productionOrders.getByStatus('IN_PRODUCTION', 0, 1).pipe(catchError(() => of(null))) : of(null),
      finished: canReadProduction ? this.productionOrders.getByStatus('FINISHED', 0, 1).pipe(catchError(() => of(null))) : of(null),
      blocked: canReadProduction ? this.productionOrders.getByStatus('BLOCKED', 0, 1).pipe(catchError(() => of(null))) : of(null)
    }).pipe(
      map(result => {
        const materialList = result.materials?.content ?? [];
        const inventoryValue = materialList.reduce((sum, m) => sum + m.stock * m.unitCost, 0);
        const criticalMaterials = materialList.filter(m => m.isCritical || m.stock <= m.stockMin).length;

        const stageCounts = new Map<ProductionStatus, number>([
          ['IN_WAITING', result.waiting?.totalElements ?? 0],
          ['IN_PRODUCTION', result.inProduction?.totalElements ?? 0],
          ['FINISHED', result.finished?.totalElements ?? 0],
          ['BLOCKED', result.blocked?.totalElements ?? 0]
        ]);

        return {
          live: [result.suppliers, result.materials, result.orders, result.pendingSales,
                 result.waiting, result.inProduction, result.finished, result.blocked]
            .some(source => source !== null),
          totalSupplierOrders: result.orders?.totalElements ?? 0,
          inventoryValue,
          criticalMaterials,
          totalSuppliers: result.suppliers?.totalElements ?? 0,
          pendingCustomerOrders: result.pendingSales?.totalElements ?? 0,
          productionStages: STAGE_ORDER.map(status => ({
            status,
            count: stageCounts.get(status) ?? 0
          })),
          suppliers: result.suppliers?.content ?? [],
          materials: materialList,
          recentOrders: result.orders?.content ?? []
        };
      })
    );
  }
}
