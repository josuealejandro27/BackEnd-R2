import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard } from "../../../components/icons";
import { ShoppingCartItem } from "../../../components/ShoppingCart";
import { GenericCard } from "../../../components/GenericCard";
import { useCart } from "../../../hooks/useCart";
import { OrderService } from "../../../api/endpoints/orderService";

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const total = getTotalCart();
  const canUseDeferredPayment = total >= 5000;

  const formatCurrency = (amount: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

  const handleContinueToPayment = async () => {
    try {
      setLoading(true);

      // Preparar datos de la orden
      const orderData = {
        customer_email: "cliente@ejemplo.com", // Esto lo puedes obtener de un formulario
        customer_name: "Cliente Ejemplo",
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      // Crear orden en el backend
      const orderResponse = await OrderService.createOrder(orderData);

      // Guardar el orderId en sessionStorage para usarlo en el pago
      sessionStorage.setItem("orderId", orderResponse.orderId.toString());
      sessionStorage.setItem("orderNumber", orderResponse.orderNumber);

      // Navegar a la página de pago
      navigate("/pago");
    } catch (error: any) {
      alert(error.message || "Error al procesar la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Carrito de Compras</h2>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <ShoppingCartItem key={item.id} item={item} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
            ))}
          </div>

          <GenericCard >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-700">Total:</span>
              <span className="text-3xl font-bold text-green-600">{formatCurrency(total)}</span>
            </div>

            {canUseDeferredPayment ? (
              <button
                onClick={handleContinueToPayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Continuar a Pagos Diferidos
                  </>
                )}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-red-600 font-semibold mb-2">Monto mínimo para pagos diferidos: $5,000</p>
                <p className="text-gray-600">Te faltan {formatCurrency(5000 - total)} para acceder a esta promoción</p>
              </div>
            )}
          </GenericCard>
        </>
      )}
    </div>
  );
};
