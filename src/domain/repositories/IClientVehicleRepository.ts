import {ClientVehicle} from '../entities/ClientVehicle';
import {Vehicle} from '../entities/Vehicle';
import {VehicleType} from '../entities/VehicleType';

export interface ClientVehicleWithDetails extends ClientVehicle {
  vehicle: Vehicle;
  vehicleType: VehicleType;
}

export interface IClientVehicleRepository {
  getByClientId(clientId: number): Promise<ClientVehicleWithDetails[]>;
  create(clientId: number, vehicleId: number): Promise<ClientVehicle>;
}
