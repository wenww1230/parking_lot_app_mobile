import {getDb} from '../datasources/SqliteDatabase';
import {ClientDebt} from '../../domain/entities/ClientDebt';
import {IDebtReportRepository} from '../../domain/repositories/IDebtReportRepository';

export class DebtReportRepositoryImpl implements IDebtReportRepository {
  async getClientsByDebt(): Promise<ClientDebt[]> {
    const db = await getDb();
    const [result] = await db.executeSql(`
      SELECT c.id as clientId, c.name as clientName, c.phone as clientPhone,
        COALESCE(SUM(ph.soles - COALESCE(ph.paid_amount, 0)), 0) as totalDebt,
        COUNT(ph.id) as pendingCount
      FROM clients c
      JOIN client_vehicles cv ON cv.client_id = c.id
      JOIN parking_history ph ON ph.client_vehicle_id = cv.id AND COALESCE(ph.paid_amount, 0) < ph.soles
      GROUP BY c.id
      HAVING totalDebt > 0
      ORDER BY totalDebt DESC
    `);
    const list: ClientDebt[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      list.push({
        clientId: row.clientId,
        clientName: row.clientName,
        clientPhone: row.clientPhone,
        totalDebt: row.totalDebt,
        pendingCount: row.pendingCount,
      });
    }
    return list;
  }
}
