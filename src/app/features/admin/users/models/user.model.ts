export interface UserRequest {
  name: string;
  email: string;
  password?: string | null;
  phone?: string;
  roleId: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleName: string;
}
