import {getDb} from '../datasources/SqliteDatabase';
import {getPeruLimaNow} from '../../utils/dateUtils';
import {IParkingRecordRepository, ParkingRecordFilters} from '../../domain/repositories/IParkingRecordRepository';
import {ParkingRecordWithDetails} from '../../domain/entities/ParkingRecordWithDetails';
import {buildWhereClause} from './utils/buildParkingRecordWhereClause';

export class ParkingRecordRepositoryImpl implements IParkingRecordRepository {
  async getWithDetails(
    limit: number,
    offset: number,
    filters?: ParkingRecordFilters
  ): Promise<ParkingRecordWithDetails[]> {
    const db = await getDb();
    const {sql: whereClause, params} = buildWhereClause(filters);
    const query = `
      SELECT ph.id, c.name as clientName, c.phone as clientPhone,
        v.placa, vt.name as vehicleType, v.color as vehicleColor,
        ph.hora_ingreso as horaIngreso, ph.hora_salida as horaSalida,
        ph.detalle, ph.soles, COALESCE(ph.paid_amount, 0) as paidAmount
      FROM parking_history ph
      JOIN client_vehicles cv ON ph.client_vehicle_id = cv.id
      JOIN clients c ON cv.client_id = c.id
      JOIN vehicles v ON cv.vehicle_id = v.id
      JOIN vehicle_types vt ON v.type_id = vt.id
      ${whereClause}
      ORDER BY ph.hora_ingreso DESC
      LIMIT ? OFFSET ?
    `;
    const [result] = await db.executeSql(query, [...params, limit, offset]);
    const list: ParkingRecordWithDetails[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      list.push({
        id: row.id,
        clientName: row.clientName,
        clientPhone: row.clientPhone,
        placa: row.placa,
        vehicleType: row.vehicleType,
        vehicleColor: row.vehicleColor,
        horaIngreso: row.horaIngreso,
        horaSalida: row.horaSalida,
        detalle: row.detalle,
        soles: row.soles,
        paidAmount: row.paidAmount ?? 0,
        estadoPago: (row.paidAmount ?? 0) >= row.soles ? 'PAGADO' : 'DEUDA',
      });
    }
    return list;
  }

  async create(
    clientVehicleId: number,
    detalle: string,
    soles: number,
    horaIngreso?: string,
    pagoInicial?: number
  ): Promise<number> {
    const db = await getDb();
    const hora = horaIngreso || getPeruLimaNow();
    const paid = Math.min(Math.max(0, pagoInicial ?? 0), soles);
    await db.executeSql(
      'INSERT INTO parking_history (client_vehicle_id, hora_ingreso, hora_salida, detalle, soles, tariff_amount, paid_amount) VALUES (?, ?, NULL, ?, ?, ?, ?)',
      [clientVehicleId, hora, detalle, soles, soles, paid]
    );
    const [result] = await db.executeSql('SELECT last_insert_rowid() as id');
    return result.rows.item(0).id;
  }

  async update(
    id: number,
    horaSalida: string,
    detalle: string,
    soles: number,
    estadoPago?: string,
    abonar?: number
  ): Promise<void> {
    const db = await getDb();
    const updates: string[] = ['hora_salida = ?', 'detalle = ?', 'soles = ?'];
    const params: (string | number)[] = [horaSalida, detalle, soles];
    if (estadoPago === 'PAGADO') {
      updates.push('paid_amount = soles');
    } else if (abonar != null && abonar > 0) {
      updates.push('paid_amount = COALESCE(paid_amount, 0) + ?');
      params.push(abonar);
    }
    params.push(id);
    await db.executeSql(
      `UPDATE parking_history SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
  }

  async markAsPaid(id: number): Promise<void> {
    const db = await getDb();
    await db.executeSql('UPDATE parking_history SET paid_amount = soles WHERE id = ?', [id]);
  }

  async addToPaidAmount(id: number, amount: number): Promise<void> {
    const db = await getDb();
    await db.executeSql(
      'UPDATE parking_history SET paid_amount = COALESCE(paid_amount, 0) + ? WHERE id = ?',
      [amount, id]
    );
  }

  async getHistoricalDebtExcludingRecord(recordId: number): Promise<number> {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT COALESCE(SUM(ph.soles - COALESCE(ph.paid_amount, 0)), 0) as total
       FROM parking_history ph
       JOIN client_vehicles cv ON ph.client_vehicle_id = cv.id
       WHERE ph.id != ? AND COALESCE(ph.paid_amount, 0) < ph.soles
       AND cv.client_id = (
         SELECT cv2.client_id FROM parking_history ph2
         JOIN client_vehicles cv2 ON ph2.client_vehicle_id = cv2.id
         WHERE ph2.id = ?
       )`,
      [recordId, recordId]
    );
    return result.rows.length > 0 ? (result.rows.item(0).total ?? 0) : 0;
  }

  async getUnpaidRecordsForClient(clientId: number): Promise<Array<{id: number; balance: number}>> {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT ph.id, (ph.soles - COALESCE(ph.paid_amount, 0)) as balance
       FROM parking_history ph
       JOIN client_vehicles cv ON ph.client_vehicle_id = cv.id
       WHERE cv.client_id = ? AND COALESCE(ph.paid_amount, 0) < ph.soles
       ORDER BY ph.hora_ingreso ASC`,
      [clientId]
    );
    const list: Array<{id: number; balance: number}> = [];
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      list.push({id: row.id, balance: row.balance});
    }
    return list;
  }

  async getById(id: number): Promise<ParkingRecordWithDetails | null> {
    const db = await getDb();
    const [result] = await db.executeSql(
      `SELECT ph.id, c.name as clientName, c.phone as clientPhone,
        v.placa, vt.name as vehicleType, v.color as vehicleColor,
        ph.hora_ingreso as horaIngreso, ph.hora_salida as horaSalida,
        ph.detalle, ph.soles, COALESCE(ph.paid_amount, 0) as paidAmount
       FROM parking_history ph
       JOIN client_vehicles cv ON ph.client_vehicle_id = cv.id
       JOIN clients c ON cv.client_id = c.id
       JOIN vehicles v ON cv.vehicle_id = v.id
       JOIN vehicle_types vt ON v.type_id = vt.id
       WHERE ph.id = ?`,
      [id]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows.item(0);
    return {
      id: row.id,
      clientName: row.clientName,
      clientPhone: row.clientPhone,
      placa: row.placa,
      vehicleType: row.vehicleType,
      vehicleColor: row.vehicleColor,
      horaIngreso: row.horaIngreso,
      horaSalida: row.horaSalida,
      detalle: row.detalle,
      soles: row.soles,
      paidAmount: row.paidAmount ?? 0,
      estadoPago: (row.paidAmount ?? 0) >= row.soles ? 'PAGADO' : 'DEUDA',
    };
  }
}
