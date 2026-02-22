import {ClientDebt} from '../repositories/IDebtReportRepository';
import {IDebtReportRepository} from '../repositories/IDebtReportRepository';

export class DebtReportUseCase {
  constructor(private debtReportRepository: IDebtReportRepository) {}

  async getClientsByDebt(): Promise<ClientDebt[]> {
    return this.debtReportRepository.getClientsByDebt();
  }
}
