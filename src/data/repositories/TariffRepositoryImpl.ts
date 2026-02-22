import {getDb} from '../datasources/SqliteDatabase';
import {Tariff, ITariffRepository} from '../../domain/repositories/ITariffRepository';

export class TariffRepositoryImpl implements ITariffRepository {
  async getAll(): Promise<Tariff[]> {
    const db = await getDb();
    const [result] = await db.executeSql(`
      SELECT t.id, vt.id as vehicleTypeId, vt.name as vehicleTypeName, COALESCE(t.amount, 0) as amount
      FROM vehicle_types vt
      LEFT JOIN tariffs t ON t.vehicle_type_id = vt.id
      ORDER BY vt.name
    `);
    const list: Tariff[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      list.push({
        id: row.id || 0,
        vehicleTypeId: row.vehicleTypeId,
        vehicleTypeName: row.vehicleTypeName,
        amount: row.amount || 0,
      });
    }
    return list;
  }

  async getByVehicleTypeId(vehicleTypeId: number): Promise<Tariff | null> {
    const db = await getDb();
    const [vtResult] = await db.executeSql(
      'SELECT id, name FROM vehicle_types WHERE id = ?',
      [vehicleTypeId]
    );
    if (vtResult.rows.length === 0) return null;
    const vt = vtResult.rows.item(0);
    const [tResult] = await db.executeSql(
      'SELECT amount FROM tariffs WHERE vehicle_type_id = ?',
      [vehicleTypeId]
    );
    const amount = tResult.rows.length > 0 ? tResult.rows.item(0).amount : 0;
    return {
      id: 0,
      vehicleTypeId: vt.id,
      vehicleTypeName: vt.name,
      amount,
    };
  }

  async upsert(vehicleTypeId: number, amount: number): Promise<void> {
    const db = await getDb();
    const [existing] = await db.executeSql(
      'SELECT id FROM tariffs WHERE vehicle_type_id = ?',
      [vehicleTypeId]
    );
    if (existing.rows.length > 0) {
      await db.executeSql('UPDATE tariffs SET amount = ? WHERE vehicle_type_id = ?', [
        amount,
        vehicleTypeId,
      ]);
    } else {
      await db.executeSql('INSERT INTO tariffs (vehicle_type_id, amount) VALUES (?, ?)', [
        vehicleTypeId,
        amount,
      ]);
    }
  }
}
