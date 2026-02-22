import {ParkingRecordFilters} from '../../../domain/types/ParkingRecordFilters';

export function buildWhereClause(filters?: ParkingRecordFilters): {
  sql: string;
  params: (string | number)[];
} {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  if (filters?.clientQuery?.trim()) {
    conditions.push('(c.name LIKE ? OR c.phone LIKE ?)');
    const p = `%${filters.clientQuery.trim()}%`;
    params.push(p, p);
  }
  if (filters?.vehicleQuery?.trim()) {
    conditions.push('(v.placa LIKE ? OR vt.name LIKE ?)');
    const p = `%${filters.vehicleQuery.trim()}%`;
    params.push(p, p);
  }
  if (filters?.dateFrom) {
    conditions.push("date(ph.hora_ingreso) >= date(?)");
    params.push(filters.dateFrom);
  }
  if (filters?.dateTo) {
    conditions.push("date(ph.hora_ingreso) <= date(?)");
    params.push(filters.dateTo);
  }
  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  return {sql: whereClause, params};
}
