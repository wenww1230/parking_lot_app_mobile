export type EstadoPago = 'PAGADO' | 'DEUDA';

export interface ParkingRecordWithDetails {
  id: number;
  clientName: string;
  clientPhone: string;
  placa: string;
  vehicleType: string;
  vehicleColor: string;
  horaIngreso: string;
  horaSalida: string | null;
  detalle: string;
  soles: number;
  paidAmount: number;
  estadoPago: EstadoPago;
}
