import {Tariff} from '../entities/Tariff';

export type {Tariff};

export interface ITariffRepository {
  getAll(): Promise<Tariff[]>;
  getByVehicleTypeId(vehicleTypeId: number): Promise<Tariff | null>;
  upsert(vehicleTypeId: number, amount: number): Promise<void>;
}
