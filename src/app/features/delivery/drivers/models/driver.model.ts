export interface DriverRequest {
  name: string;
  phone: string;
  licenseNumber: string;
  isAvailable?: boolean;
}

export interface DriverResponse {
  name: string;
  phone: string;
  licenseNumber: string;
  isAvailable: boolean;
}
