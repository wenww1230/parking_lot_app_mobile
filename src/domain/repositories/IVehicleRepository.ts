import {Vehicle} from '../entities/Vehicle';
import {VehicleType} from '../entities/VehicleType';

export interface IVehicleRepository {
  getTypes(): Promise<VehicleType[]>;
  createType(name: string): Promise<VehicleType>;
  create(typeId: number, color: string, placa: string, marca: string): Promise<Vehicle>;
  getById(id: number): Promise<Vehicle | null>;
}
