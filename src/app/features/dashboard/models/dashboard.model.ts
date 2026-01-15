export interface DashboardStats {
  totalOrders: number;
  inventoryValue: number;
  pendingDeliveries: number;
  lowStockItems: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  amount: number;
  date: string;
}

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface LowStockMaterial {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
}

export interface SupplierPerformance {
  name: string;
  totalOrders: number;
  onTimeDeliveryRate: number;
  rating: number;
}

export interface OrderTrend {
  date: string;
  orders: number;
}
