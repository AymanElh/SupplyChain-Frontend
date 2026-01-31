export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  street: string;
  createdAt?: string;
}

export interface CustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  street: string;
}

export interface CustomerPageResponse {
  content: Customer[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}