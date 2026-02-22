import {IPaymentRepository} from '../repositories/IPaymentRepository';

export class PaymentUseCase {
  constructor(private paymentRepository: IPaymentRepository) {}

  async registerPayment(clientId: number, amount: number, detalle?: string): Promise<void> {
    return this.paymentRepository.registerPayment(clientId, amount, detalle);
  }
}
