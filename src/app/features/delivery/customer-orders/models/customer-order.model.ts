export type CustomerOrderStatus =
  | 'PENDING'
  | 'IN_PREPARATION'
  | 'READY'
  | 'IN_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export const CUSTOMER_ORDER_STATUSES: CustomerOrderStatus[] = [
  'PENDING',
  'IN_PREPARATION',
  'READY',
  'IN_WAY',
  'DELIVERED',
  'CANCELLED'
];

export type CustomerOrderFilter = 'ALL' | CustomerOrderStatus;

export interface CustomerOrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CustomerOrderRequest {
  customerId: number;
  addressId: number;
  orderItems: CustomerOrderItemRequest[];
}

export interface CustomerOrderItemResponse {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    cost: number;
  };
  unitPrice: number;
  subTotal: number;
}

export interface CustomerOrderCustomer {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface CustomerOrderAddress {
  id: number;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface CustomerOrderResponse {
  id: number;
  quantity: number;
  customer: CustomerOrderCustomer;
  orderItems: CustomerOrderItemResponse[];
  status: CustomerOrderStatus;
  orderDate: string;
  totalAmount: number;
  shippingAddress: CustomerOrderAddress;
}

export interface UpdateCustomerOrderStatusRequest {
  status: CustomerOrderStatus;
}
