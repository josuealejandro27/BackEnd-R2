import { Product } from "../../types";
import { apiService } from "./api";

export class ProductService {
  // Obtener todos los productos
  static async getAllProducts(): Promise<Product[]> {
    return apiService.get<Product[]>("/products");
  }

  // Obtener producto por ID
  static async getProductById(id: number): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  }

  // Obtener productos por categoría
  static async getProductsByCategory(category: string): Promise<Product[]> {
    return apiService.get<Product[]>(`/products/category/${category}`);
  }
}
