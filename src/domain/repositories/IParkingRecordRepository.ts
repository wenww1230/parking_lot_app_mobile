import {ParkingRecordWithDetails} from '../entities/ParkingRecordWithDetails';
import {ParkingRecordFilters} from '../types/ParkingRecordFilters';

export type {ParkingRecordFilters};
export interface IParkingRecordRepository {
  getWithDetails(
    limit: number,
    offset: number,
    filters?: ParkingRecordFilters
  ): Promise<ParkingRecordWithDetails[]>;
  create(
    clientVehicleId: number,
    detalle: string,
    soles: number,
    horaIngreso?: string,
    pagoInicial?: number
  ): Promise<number>;
  update(
    id: number,
    horaSalida: string,
    detalle: string,
    soles: number,
    estadoPago?: string,
    abonar?: number
  ): Promise<void>;
  markAsPaid(id: number): Promise<void>;
  addToPaidAmount(id: number, amount: number): Promise<void>;
  getUnpaidRecordsForClient(clientId: number): Promise<Array<{id: number; balance: number}>>;
  getHistoricalDebtExcludingRecord(recordId: number): Promise<number>;
  getById(id: number): Promise<ParkingRecordWithDetails | null>;
}
