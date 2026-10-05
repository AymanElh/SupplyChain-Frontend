export type ProductionStatus = 'IN_WAITING' | 'IN_PRODUCTION' | 'FINISHED' | 'BLOCKED';

export type ProductionOrderFilter = 'ALL' | ProductionStatus;

export const PRODUCTION_STATUSES: ProductionStatus[] = [
  'IN_WAITING',
  'IN_PRODUCTION',
  'FINISHED',
  'BLOCKED'
];

export interface ProductionOrderRequest {
  productId: number;
  quantity: number;
  priority?: number;
  startDate?: string;
}

export interface ProductionOrderResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priority: number;
  status: ProductionStatus;
  startDate: string;
  endDate: string;
}

export interface UpdateProductionOrderStatusRequest {
  status: ProductionStatus;
}

export interface UpdateProductionOrderQuantityRequest {
  quantity: number;
}
