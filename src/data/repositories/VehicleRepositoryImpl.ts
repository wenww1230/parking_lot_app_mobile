import {getDb} from '../datasources/SqliteDatabase';
import {Vehicle} from '../../domain/entities/Vehicle';
import {VehicleType} from '../../domain/entities/VehicleType';
import {IVehicleRepository} from '../../domain/repositories/IVehicleRepository';

export class VehicleRepositoryImpl implements IVehicleRepository {
  async createType(name: string): Promise<VehicleType> {
    const db = await getDb();
    await db.executeSql('INSERT INTO vehicle_types (name) VALUES (?)', [name.trim()]);
    const [result] = await db.executeSql('SELECT last_insert_rowid() as id');
    const id = result.rows.item(0).id;
    return {id, name: name.trim()};
  }

  async getTypes(): Promise<VehicleType[]> {
    const db = await getDb();
    const [result] = await db.executeSql('SELECT id, name FROM vehicle_types ORDER BY name');
    const list: VehicleType[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      list.push({id: row.id, name: row.name});
    }
    return list;
  }

  async create(typeId: number, color: string, placa: string, marca: string): Promise<Vehicle> {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO vehicles (type_id, color, placa, marca) VALUES (?, ?, ?, ?)',
      [typeId, color, placa, marca]
    );
    const [result] = await db.executeSql('SELECT last_insert_rowid() as id');
    const id = result.rows.item(0).id;
    return {id, typeId, color, placa, marca};
  }

  async getById(id: number): Promise<Vehicle | null> {
    const db = await getDb();
    const [result] = await db.executeSql(
      'SELECT id, type_id as typeId, color, placa, marca FROM vehicles WHERE id = ?',
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows.item(0);
    return {id: row.id, typeId: row.typeId, color: row.color, placa: row.placa, marca: row.marca};
  }
}
