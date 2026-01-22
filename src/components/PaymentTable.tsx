// src/components/PaymentTable.tsx (VERSIÓN FINAL CON VALIDACIÓN)
import React from "react";
import { PaymentResult } from "../types";
import { Calendar } from "./icons";

interface PaymentTableProps {
  result: PaymentResult;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({ result }) => {
  // DEBUG: Ver qué está recibiendo
  console.log("PaymentTable received:", result);
  console.log("Schedule:", result?.schedule);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha inválida";
    }
  };

  // VALIDACIONES
  if (!result) {
    return <div className="text-center py-8 text-red-600">Error: No se recibieron datos de pago</div>;
  }

  if (!result.schedule) {
    return <div className="text-center py-8 text-red-600">Error: No hay calendario de pagos (schedule es undefined)</div>;
  }

  if (!Array.isArray(result.schedule)) {
    return <div className="text-center py-8 text-red-600">Error: El calendario de pagos no es un array</div>;
  }

  if (result.schedule.length === 0) {
    return <div className="text-center py-8 text-gray-600">No hay pagos programados</div>;
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Tabla de Amortización - {result.months || 0} Meses
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pago #</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha de Pago</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Monto Mensual</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {result.schedule.map((payment, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{payment?.number || index + 1}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment?.date ? formatDate(payment.date) : "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-lg font-semibold text-green-600">{formatCurrency(payment?.amount || 0)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-lg font-bold text-gray-800">{formatCurrency(payment?.accumulated || 0)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
