export interface SupplierRequest {
  name: string;
  phone: string;
  email?: string;
  rating?: number;
  leadTime?: number;
}


export interface SupplierResponse {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  rating?: number;
  leadTime?: number;
  materials?: RawMaterialResponse[];
}

export interface RawMaterialResponse {
  id: number;
  name: string;
  stock: number;
  stockMin: number;
  unit: string;
  unitCost: number;
  isCritical: boolean;
}
