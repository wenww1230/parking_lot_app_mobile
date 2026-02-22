import {getDb} from '../datasources/SqliteDatabase';
import {getPeruLimaNow} from '../../utils/dateUtils';
import {IPaymentRepository} from '../../domain/repositories/IPaymentRepository';
import {ParkingRecordRepositoryImpl} from './ParkingRecordRepositoryImpl';

export class PaymentRepositoryImpl implements IPaymentRepository {
  async registerPayment(clientId: number, amount: number, detalle?: string): Promise<void> {
    const db = await getDb();
    const fecha = getPeruLimaNow();
    await db.executeSql(
      'INSERT INTO payments (client_id, amount, fecha, detalle) VALUES (?, ?, ?, ?)',
      [clientId, amount, fecha, detalle ?? 'Pago de deuda']
    );
    const parkingRepo = new ParkingRecordRepositoryImpl();
    const unpaidRecords = await parkingRepo.getUnpaidRecordsForClient(clientId);
    let remaining = amount;
    for (const rec of unpaidRecords) {
      if (remaining <= 0) break;
      const toAdd = Math.min(remaining, rec.balance);
      await parkingRepo.addToPaidAmount(rec.id, toAdd);
      remaining -= toAdd;
    }
  }
}
