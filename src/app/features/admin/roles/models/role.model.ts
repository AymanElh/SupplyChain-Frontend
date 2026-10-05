export interface RoleRequest {
  name: string;
}

export interface RoleResponse {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
