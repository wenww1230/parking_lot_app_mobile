export interface IPaymentRepository {
  registerPayment(clientId: number, amount: number, detalle?: string): Promise<void>;
}
