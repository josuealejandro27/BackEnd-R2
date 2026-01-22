import { apiService } from "./api";

export interface CreateOrderRequest {
  customer_email?: string;
  customer_name?: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface OrderResponse {
  orderId: number;
  orderNumber: string;
}

export class OrderService {
  // Crear una nueva orden
  static async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    return apiService.post<OrderResponse>("/orders", orderData);
  }

  // Obtener orden por ID
  static async getOrderById(id: number): Promise<any> {
    return apiService.get<any>(`/orders/${id}`);
  }
}
