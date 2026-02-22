import {ParkingRecordFilters, IParkingRecordRepository} from '../repositories/IParkingRecordRepository';
import {ParkingRecordWithDetails} from '../entities/ParkingRecordWithDetails';

export class ParkingRecordUseCase {
  constructor(private parkingRecordRepository: IParkingRecordRepository) {}

  async getRecords(
    limit: number = 10,
    offset: number = 0,
    filters?: ParkingRecordFilters
  ): Promise<ParkingRecordWithDetails[]> {
    return this.parkingRecordRepository.getWithDetails(limit, offset, filters);
  }

  async addRecord(
    clientVehicleId: number,
    detalle: string,
    soles: number,
    horaIngreso?: string,
    pagoInicial?: number
  ): Promise<number> {
    return this.parkingRecordRepository.create(
      clientVehicleId,
      detalle,
      soles,
      horaIngreso,
      pagoInicial
    );
  }

  async updateRecord(
    id: number,
    horaSalida: string,
    detalle: string,
    soles: number,
    estadoPago?: string,
    abonar?: number
  ): Promise<void> {
    return this.parkingRecordRepository.update(id, horaSalida, detalle, soles, estadoPago, abonar);
  }

  async markAsPaid(id: number): Promise<void> {
    return this.parkingRecordRepository.markAsPaid(id);
  }

  async getRecordById(id: number): Promise<ParkingRecordWithDetails | null> {
    return this.parkingRecordRepository.getById(id);
  }

  async getDebtSummaryForRecord(recordId: number): Promise<{
    currentRecordDebt: number;
    historicalDebt: number;
  } | null> {
    const record = await this.parkingRecordRepository.getById(recordId);
    if (!record) return null;
    const currentRecordDebt = record.soles - record.paidAmount;
    const historicalDebt = await this.parkingRecordRepository.getHistoricalDebtExcludingRecord(
      recordId
    );
    return {currentRecordDebt, historicalDebt};
  }
}
