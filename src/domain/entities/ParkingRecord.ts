export interface ParkingRecord {
  id: number;
  clientVehicleId: number;
  horaIngreso: string;
  horaSalida: string | null;
  detalle: string;
  soles: number;
}
