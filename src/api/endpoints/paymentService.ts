import { PaymentResult } from "../../types";
import { apiService } from "./api";

export interface CreatePaymentRequest {
  order_id: number;
  bank_id: string;
}

export class PaymentService {
  // Crear plan de pagos diferidos
  static async createPaymentPlan(paymentData: CreatePaymentRequest): Promise<PaymentResult> {
    return apiService.post<PaymentResult>("/payments", paymentData);
  }

  // Obtener plan de pagos por orden
  static async getPaymentByOrderId(orderId: number): Promise<any> {
    return apiService.get<any>(`/payments/order/${orderId}`);
  }
}
