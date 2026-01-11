export interface RawMaterialRequest {
    name: string;
    stock: number;
    stockMin: number;
    unitCost: number;
    unit: string;
    supplierId: number[];
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