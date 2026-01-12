// Enum matching backend OrderStatus
export enum OrderStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  RECEIVED = 'RECEIVED'
}

export interface SupplierOrderRequest {
  supplierId: number;
  orderDate?: string;
  status?: OrderStatus;
  items: SupplierOrderItemRequest[];
}

export interface SupplierOrderResponse {
  id: number;
  supplierId: number;
  supplierName: string;
  status: OrderStatus;
  orderDate: string;
  items: SupplierOrderItemResponse[];
}

export interface SupplierOrderItemRequest {
  rawMaterialId: number;
  quantity: number;
  unitPrice: number;
}

export interface SupplierOrderItemResponse {
  id: number;
  rawMaterialId: number;
  rawMaterialName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}
