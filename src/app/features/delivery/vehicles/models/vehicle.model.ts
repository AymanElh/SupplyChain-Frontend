export interface VehicleRequest {
  licensePlate: string;
  type?: string;
  model?: string;
}

export interface VehicleResponse {
  id: number;
  licensePlate: string;
  type?: string;
  model?: string;
}
