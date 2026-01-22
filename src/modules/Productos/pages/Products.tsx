// src/modules/Productos/pages/Products.tsx (CORREGIDO)
import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../../../components/ProductCard";
import { useCart } from "../../../hooks/useCart";
import { useProducts } from "../../../hooks/useProducts";
import { X } from "../../../components/icons"; // ← AGREGAR ESTE IMPORT

export const ProductsPage: React.FC = () => {
  const { addToCart, cart } = useCart();
  const { products, loading, error } = useProducts();
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtro por categoría
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || (p.category && p.category.toLowerCase().includes(term)),
      );
    }

    return filtered;
  }, [products, category, searchTerm]);

  const handleAddToCart = (product: any) => {
    if (!product.stock || product.stock <= 0) {
      alert("Este producto no tiene stock disponible");
      return;
    }

    const itemInCart = cart.find((item) => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (quantityInCart >= product.stock) {
      alert(`Solo hay ${product.stock} unidades disponibles de este producto`);
      return;
    }

    addToCart(product);

    const remainingStock = product.stock - quantityInCart - 1;
    if (remainingStock <= 5 && remainingStock > 0) {
      alert(`¡Producto agregado! Solo quedan ${remainingStock} unidades disponibles`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-red-600 text-lg mb-2">{error}</p>
        <p className="text-gray-600 mb-4">No pudimos cargar los productos</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header con filtros activos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {searchTerm ? `Resultados para "${searchTerm}"` : category && category !== "all" ? `Categoría: ${category}` : "Todos los Productos"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
        </div>

        {(searchTerm || (category && category !== "all")) && (
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No encontramos productos</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? `No hay productos que coincidan con "${searchTerm}"` : "Intenta con otros términos de búsqueda o navega por las categorías"}
          </p>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
};
