export type DeliveryStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELED';

export const DELIVERY_STATUSES: DeliveryStatus[] = [
  'SCHEDULED',
  'IN_PROGRESS',
  'DELIVERED',
  'FAILED',
  'CANCELED'
];

export interface DeliveryRequest {
  orderId: number;
  driverId: number;
  vehicleId: number;
  deliveryDate: string;
}

export interface DeliveryOrderInfo {
  id: number;
  name: string;
  totalAmount: number;
}

export interface DeliveryDriverInfo {
  id: number;
  name: string;
  phone: string;
}

export interface DeliveryVehicleInfo {
  id: number;
  licensePlate: string;
}

export interface DeliveryResponse {
  id: number;
  order: DeliveryOrderInfo;
  driver: DeliveryDriverInfo;
  vehicle: DeliveryVehicleInfo;
  status: DeliveryStatus;
  deliveryDate: string;
}

export interface UpdateDeliveryStatusRequest {
  status: DeliveryStatus;
}
