// src/components/ProductCard.tsx (CON IMÁGENES REALES)
import React, { useState } from "react";
import { Product } from "../types";
import { GenericCard } from "./GenericCard";
import { Package } from "./icons";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);

  // Verificar si el producto tiene stock
  const hasStock = product.stock && product.stock > 0;
  const lowStock = product.stock && product.stock <= 10;

  // Imagen de fallback si hay error
  const fallbackImage = "https://via.placeholder.com/300x300/e5e7eb/6b7280?text=Sin+Imagen";

  return (
    <GenericCard>
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden h-64">
        {/* Skeleton loader mientras carga */}
        {imageLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}

        {/* Imagen del producto */}
        <img
          src={imageError ? fallbackImage : product.image}
          alt={product.name}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
        />

        {/* Badge de stock */}
        {!hasStock && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">SIN STOCK</div>}
        {hasStock && lowStock && <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">¡ÚLTIMAS UNIDADES!</div>}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Precio */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-green-600">{formatCurrency(parseFloat(product.price.toString()))}</span>
        </div>

        {/* Stock disponible */}
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-gray-500" />
          <span className={`text-sm font-medium ${!hasStock ? "text-red-600" : lowStock ? "text-orange-600" : "text-green-600"}`}>
            {hasStock ? `${product.stock} disponibles` : "Agotado"}
          </span>
        </div>

        {/* Botón */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={!hasStock}
          className={`w-full mt-3 py-2 rounded-lg font-medium transition-colors ${
            hasStock ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {hasStock ? "Agregar al carrito" : "Sin stock"}
        </button>
      </div>
    </GenericCard>
  );
};
