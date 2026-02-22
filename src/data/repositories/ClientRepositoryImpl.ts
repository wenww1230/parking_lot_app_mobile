import {getDb} from '../datasources/SqliteDatabase';
import {Client} from '../../domain/entities/Client';
import {IClientRepository} from '../../domain/repositories/IClientRepository';

export class ClientRepositoryImpl implements IClientRepository {
  async getAll(): Promise<Client[]> {
    const db = await getDb();
    const [result] = await db.executeSql('SELECT id, name, phone FROM clients ORDER BY name');
    const list: Client[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      list.push({id: row.id, name: row.name ?? '', phone: row.phone ?? ''});
    }
    return list;
  }

  async getById(id: number): Promise<Client | null> {
    const db = await getDb();
    const [result] = await db.executeSql('SELECT id, name, phone FROM clients WHERE id = ?', [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows.item(0);
    return {id: row.id, name: row.name ?? '', phone: row.phone ?? ''};
  }

  async searchByNameOrPhone(query: string): Promise<Client[]> {
    const db = await getDb();
    const pattern = `%${query}%`;
    const [result] = await db.executeSql(
      'SELECT id, name, phone FROM clients WHERE name LIKE ? OR phone LIKE ? ORDER BY name',
      [pattern, pattern]
    );
    const list: Client[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      list.push({id: row.id, name: row.name ?? '', phone: row.phone ?? ''});
    }
    return list;
  }

  async create(name: string, phone: string): Promise<Client> {
    const db = await getDb();
    await db.executeSql('INSERT INTO clients (name, phone) VALUES (?, ?)', [name, phone]);
    const [result] = await db.executeSql('SELECT last_insert_rowid() as id');
    const id = result.rows.item(0).id;
    return {id, name: name ?? '', phone: phone ?? ''};
  }

  async update(id: number, name: string, phone: string): Promise<void> {
    const db = await getDb();
    await db.executeSql('UPDATE clients SET name = ?, phone = ? WHERE id = ?', [
      name,
      phone,
      id,
    ]);
  }

  async delete(id: number): Promise<void> {
    const db = await getDb();
    const [cvResult] = await db.executeSql(
      'SELECT id FROM client_vehicles WHERE client_id = ?',
      [id]
    );
    const cvIds: number[] = [];
    for (let i = 0; i < cvResult.rows.length; i++) {
      cvIds.push(cvResult.rows.item(i).id);
    }
    if (cvIds.length > 0) {
      const placeholders = cvIds.map(() => '?').join(',');
      await db.executeSql(
        `DELETE FROM parking_history WHERE client_vehicle_id IN (${placeholders})`,
        cvIds
      );
      await db.executeSql('DELETE FROM client_vehicles WHERE client_id = ?', [id]);
    }
    await db.executeSql('DELETE FROM clients WHERE id = ?', [id]);
  }
}
