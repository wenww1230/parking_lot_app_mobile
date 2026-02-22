import {ClientDebt} from '../entities/ClientDebt';

export type {ClientDebt};
export interface IDebtReportRepository {
  getClientsByDebt(): Promise<ClientDebt[]>;
}
