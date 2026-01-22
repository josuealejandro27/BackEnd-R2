// src/modules/Pago/pages/Payment.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CreditCard, CheckCircle, AlertCircle } from "../../../components/icons";
import { useCart } from "../../../hooks/useCart";
import { CardBankDetector, CardValidator, processCardPayment } from "../../../config/banks";

export const PaymentPage: React.FC = () => {
  const { getTotalCart, clearCart } = useCart();
  const [cardNumber, setCardNumber] = useState("");
  const [detectedBank, setDetectedBank] = useState<string | null>(null);
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = getTotalCart();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);

  useEffect(() => {
    if (cardNumber.replace(/[\s-]/g, "").length >= 6) {
      const bankName = CardBankDetector.getBankName(cardNumber);
      setDetectedBank(bankName);

      if (bankName) {
        setCardError("");
      } else if (cardNumber.replace(/[\s-]/g, "").length >= 13) {
        setCardError("Tarjeta no soportada");
      }
    } else {
      setDetectedBank(null);
      setCardError("");
    }
  }, [cardNumber]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.substring(0, 16);
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const processPayment = () => {
    if (!cardNumber) {
      setCardError("Por favor ingrese un número de tarjeta");
      return;
    }

    if (!CardValidator.isValidCardNumber(cardNumber)) {
      setCardError("Número de tarjeta inválido");
      return;
    }

    if (!detectedBank) {
      setCardError("Tarjeta no soportada");
      return;
    }

    try {
      setLoading(true);
      const result = processCardPayment(cardNumber, total);

      if ("error" in result) {
        setCardError(result.error);
        return;
      }

      sessionStorage.setItem("paymentResult", JSON.stringify(result));
      clearCart();
      navigate("/resultado");
    } catch (error) {
      console.error("Error al procesar pago:", error);
      setCardError("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  // const exampleCards = [
  //   { bank: "BBVA", number: "4506 7800 0000 0018" },
  //   { bank: "Santander", number: "5234 5600 0000 0019" },
  //   { bank: "Banamex", number: "6015 6700 0000 0001" },
  // ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pagos Diferidos</h2>
        <button onClick={() => navigate("/carrito")} className="text-blue-600 hover:text-blue-700 font-medium">
          ← Volver al carrito
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-800">Total de tu compra:</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Ingresa tu tarjeta de crédito
        </h3>

        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-2">Número de Tarjeta</span>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-mono focus:outline-none transition-colors ${
              cardError ? "border-red-500 focus:border-red-600" : detectedBank ? "border-green-500 focus:border-green-600" : "border-gray-300 focus:border-blue-500"
            }`}
          />

          {detectedBank && !cardError && (
            <div className="mt-2 flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Banco detectado: {detectedBank}</span>
            </div>
          )}

          {cardError && (
            <div className="mt-2 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{cardError}</span>
            </div>
          )}
        </div>

        {detectedBank && !cardError && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Vista previa del plan:</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Meses</p>
                <p className="text-lg font-bold text-gray-800">{detectedBank.includes("BBVA") ? "9" : detectedBank.includes("Santander") ? "12" : "18"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interés</p>
                <p className="text-lg font-bold text-gray-800">{detectedBank.includes("BBVA") ? "8%" : detectedBank.includes("Santander") ? "10%" : "13%"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total aprox.</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(total * (1 + (detectedBank.includes("BBVA") ? 0.08 : detectedBank.includes("Santander") ? 0.1 : 0.13)))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={processPayment}
        disabled={!detectedBank || !!cardError || loading}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          detectedBank && !cardError && !loading ? "bg-green-600 text-white hover:bg-green-700 shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Procesando..." : detectedBank && !cardError ? `Calcular Plan de Pagos con ${detectedBank}` : "Ingresa una tarjeta válida para continuar"}
      </button>
    </div>
  );
};
