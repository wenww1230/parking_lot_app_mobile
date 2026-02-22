import {getDb} from '../datasources/SqliteDatabase';
import {ClientVehicle} from '../../domain/entities/ClientVehicle';
import {Vehicle} from '../../domain/entities/Vehicle';
import {VehicleType} from '../../domain/entities/VehicleType';
import {
  IClientVehicleRepository,
  ClientVehicleWithDetails,
} from '../../domain/repositories/IClientVehicleRepository';

export class ClientVehicleRepositoryImpl implements IClientVehicleRepository {
  async getByClientId(clientId: number): Promise<ClientVehicleWithDetails[]> {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT cv.id, cv.client_id as clientId, cv.vehicle_id as vehicleId,
        v.id as v_id, v.type_id as v_typeId, v.color as v_color, v.placa as v_placa, v.marca as v_marca,
        vt.id as vt_id, vt.name as vt_name
       FROM client_vehicles cv
       JOIN vehicles v ON cv.vehicle_id = v.id
       JOIN vehicle_types vt ON v.type_id = vt.id
       WHERE cv.client_id = ?
       ORDER BY v.placa`,
      [clientId]
    );
    const list: ClientVehicleWithDetails[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      const clientVehicle: ClientVehicle = {
        id: row.id,
        clientId: row.clientId,
        vehicleId: row.vehicleId,
      };
      const vehicle: Vehicle = {
        id: row.v_id,
        typeId: row.v_typeId,
        color: row.v_color,
        placa: row.v_placa,
        marca: row.v_marca,
      };
      const vehicleType: VehicleType = {id: row.vt_id, name: row.vt_name};
      list.push({...clientVehicle, vehicle, vehicleType});
    }
    return list;
  }

  async create(clientId: number, vehicleId: number): Promise<ClientVehicle> {
    const db = await getDb();
    await db.executeSql('INSERT INTO client_vehicles (client_id, vehicle_id) VALUES (?, ?)', [
      clientId,
      vehicleId,
    ]);
    const [result] = await db.executeSql('SELECT last_insert_rowid() as id');
    const id = result.rows.item(0).id;
    return {id, clientId, vehicleId};
  }
}
