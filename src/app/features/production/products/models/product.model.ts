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


export interface BomItem {
    id?: number;
    materialId: number;
    materialName: string;
    productId: number;
    productName: string;
    materialUnit: string;
    quantity: number;
    unitCost: number;
    totalCost: number;  
}

export interface ProductBom {
    id?: number;
    productId: number;
    items?: BomItem[];
    totalMaterialCost: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductDetailResponse extends ProductResponse {
    bom?: ProductBom;
}

/**
 * BOM creation/update request
 */
export interface BomRequest {
    items: BomItemRequest[];
}

/**
 * Individual BOM item request
 */
export interface BomItemRequest {
    rawMaterialId: number;
    quantity: number;
}