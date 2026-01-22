// src/modules/Pago/pages/Result.tsx (VERSIÓN CORREGIDA)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "../../../components/icons";
import { GenericCard } from "../../../components/GenericCard";
import { PaymentTable } from "../../../components/PaymentTable";
import { useCart } from "../../../hooks/useCart";
import { PaymentResult } from "../../../types";

export const ResultPage: React.FC = () => {
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string>("");
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem("paymentResult");

      if (!savedResult) {
        setError("No se encontró información de pago");
        navigate("/");
        return;
      }

      const parsed = JSON.parse(savedResult);

      // Validar que tenga la estructura correcta
      if (!parsed || !parsed.schedule || !Array.isArray(parsed.schedule)) {
        setError("Datos de pago inválidos");
        return;
      }

      // Convertir strings de fechas a objetos Date
      parsed.schedule = parsed.schedule.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      }));

      setResult(parsed);
    } catch (err) {
      console.error("Error al cargar resultado:", err);
      setError("Error al procesar los datos de pago");
    }
  }, [navigate]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

  const handleNewPurchase = () => {
    clearCart();
    sessionStorage.removeItem("paymentResult");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("orderNumber");
    navigate("/");
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button onClick={() => navigate("/")} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Plan de Pagos Generado!</h2>
        <p className="text-gray-600">Tu compra ha sido procesada con {result.bankName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GenericCard variant="primary" className="p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Monto Original</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(result.originalAmount || 0)}</p>
        </GenericCard>

        <GenericCard variant="danger" className="p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Interés ({((result.interestRate || 0) * 100).toFixed(0)}%)</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency((result.totalAmount || 0) - (result.originalAmount || 0))}</p>
        </GenericCard>

        <GenericCard variant="success" className="p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Total a Pagar</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalAmount || 0)}</p>
        </GenericCard>
      </div>

      <PaymentTable result={result} />

      <div className="flex gap-4 mt-6">
        <button onClick={handleNewPurchase} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          Nueva Compra
        </button>
        <button onClick={() => window.print()} className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
          Imprimir Plan
        </button>
      </div>
    </div>
  );
};
