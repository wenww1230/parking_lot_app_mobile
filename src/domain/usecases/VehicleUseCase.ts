import {Vehicle} from '../entities/Vehicle';
import {VehicleType} from '../entities/VehicleType';
import {ClientVehicleWithDetails} from '../repositories/IClientVehicleRepository';
import {IVehicleRepository} from '../repositories/IVehicleRepository';
import {IClientVehicleRepository} from '../repositories/IClientVehicleRepository';

export class VehicleUseCase {
  constructor(
    private vehicleRepository: IVehicleRepository,
    private clientVehicleRepository: IClientVehicleRepository
  ) {}

  async getVehicleTypes(): Promise<VehicleType[]> {
    return this.vehicleRepository.getTypes();
  }

  async createVehicleType(name: string): Promise<VehicleType> {
    return this.vehicleRepository.createType(name);
  }

  async getVehiclesByClientId(clientId: number): Promise<ClientVehicleWithDetails[]> {
    return this.clientVehicleRepository.getByClientId(clientId);
  }

  async createVehicle(
    typeId: number,
    color: string,
    placa: string,
    marca: string
  ): Promise<Vehicle> {
    return this.vehicleRepository.create(typeId, color.trim(), placa.trim(), marca.trim());
  }

  async assignVehicleToClient(clientId: number, vehicleId: number): Promise<ClientVehicleWithDetails> {
    await this.clientVehicleRepository.create(clientId, vehicleId);
    const list = await this.clientVehicleRepository.getByClientId(clientId);
    const found = list.find((cv) => cv.vehicleId === vehicleId);
    if (!found) throw new Error('Error al asignar vehículo');
    return found;
  }
}
