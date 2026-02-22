import {Tariff} from '../entities/Tariff';
import {ITariffRepository} from '../repositories/ITariffRepository';

export class TariffUseCase {
  constructor(private tariffRepository: ITariffRepository) {}

  async getAll(): Promise<Tariff[]> {
    return this.tariffRepository.getAll();
  }

  async getByVehicleTypeId(vehicleTypeId: number): Promise<Tariff | null> {
    return this.tariffRepository.getByVehicleTypeId(vehicleTypeId);
  }

  async setTariff(vehicleTypeId: number, amount: number): Promise<void> {
    return this.tariffRepository.upsert(vehicleTypeId, amount);
  }
}
