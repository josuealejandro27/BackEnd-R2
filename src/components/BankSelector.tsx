/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { BankInfo } from "../types";

interface BankSelectorProps {
  banks: BankInfo[];
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
  cartTotal: number;
}

export const BankSelector: React.FC<BankSelectorProps> = ({ banks, selectedBank, onSelectBank, cartTotal }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {banks.map((bank) => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          key={bank.id}
          onClick={() => onSelectBank(bank.id)}
          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
            selectedBank === bank.id ? "border-blue-600 shadow-lg scale-105" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className={`bg-gradient-to-br ${bank.color} p-6 text-white`}>
            <div className="text-5xl mb-3">{bank.icon}</div>
            <h4 className="text-2xl font-bold mb-2">{bank.name}</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{bank.months}</span>
              <span className="text-lg">meses</span>
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Tasa de interés:</span>
              <span className="text-xl font-bold text-gray-800">{bank.rate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pago mensual aprox:</span>
              <span className="text-lg font-semibold text-green-600">{formatCurrency((cartTotal * (1 + bank.rate / 100)) / bank.months)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
