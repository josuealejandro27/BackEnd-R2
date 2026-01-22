// src/components/ShoppingCart.tsx (CON IMÁGENES REALES)
import React, { useState } from "react";
import { X, Plus, Minus } from "./icons";
import { CartItem } from "../types";

interface ShoppingCartItemProps {
  item: CartItem;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
}

export const ShoppingCartItem: React.FC<ShoppingCartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);

  const fallbackImage = "https://via.placeholder.com/100x100/e5e7eb/6b7280?text=Sin+Imagen";

  return (
    <div className="flex items-center gap-4 bg-white border rounded-lg p-4">
      {/* Imagen del producto */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
        {imageLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}
        <img
          src={imageError ? fallbackImage : item.image}
          alt={item.name}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
        <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(parseFloat(item.price.toString()))}</p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-semibold w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Botón eliminar */}
      <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
