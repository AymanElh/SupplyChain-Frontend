export interface ProductRequest {
    name: string;
    productionTime: number;
    cost: number;
    stock: number;
}

export interface ProductResponse {
    id: number;
    name: string;
    productionTime: number;
    cost: number;
    materialCost?: number;
    profitMargin?: number;
    hasBom?: boolean;
}
