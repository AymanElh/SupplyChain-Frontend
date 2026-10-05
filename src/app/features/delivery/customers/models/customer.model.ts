export interface AddressRequest {
  country: string;
  postalCode: string;
  region: string;
  city: string;
  street: string;
}

export interface AddressResponse extends AddressRequest {
  id: number;
}

export interface CustomerRequest {
  name: string;
  phone: string;
  email: string;
  addresses: AddressRequest[];
}

export interface CustomerResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  addresses: AddressResponse[];
  createdAt?: string;
  updatedAt?: string;
}
