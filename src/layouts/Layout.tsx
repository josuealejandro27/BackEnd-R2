// src/layouts/Layout.tsx (CON FILTROS Y NUEVO NOMBRE)
import React, { ReactNode, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Bell, Heart, Menu, MapPin, ChevronRight, Zap, Filter } from "../components/icons";
import { useCart } from "../hooks/useCart";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Categorías disponibles
  const categories = [
    { id: "all", name: "Todos", icon: "🏪" },
    { id: "electronics", name: "Electrónica", icon: "📱" },
    { id: "computers", name: "Computadoras", icon: "💻" },
    { id: "tablets", name: "Tablets", icon: "📲" },
    { id: "audio", name: "Audio", icon: "🎧" },
    { id: "wearables", name: "Wearables", icon: "⌚" },
    { id: "gaming", name: "Gaming", icon: "🎮" },
    { id: "tv", name: "TV & Video", icon: "📺" },
    { id: "cameras", name: "Cámaras", icon: "📷" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm.trim() });
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      setSearchParams({});
      navigate("/");
    } else {
      setSearchParams({ category: categoryId });
      navigate(`/?category=${categoryId}`);
    }
    setShowMobileMenu(false);
  };

  const currentCategory = searchParams.get("category") || "all";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-white">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Envío gratis a Dolores Hidalgo 37806</span>
            </div>
            <div className="hidden md:block">
              <span className="font-semibold">⚡ Ofertas relámpago - Hasta 50% OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer flex-shrink-0 group">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-2 shadow-lg group-hover:shadow-xl transition-all">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TechHub</h1>
                <p className="text-xs text-gray-600 -mt-1">Tu hub tecnológico</p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar productos, marcas y más..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={() => navigate("/carrito")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Desktop Categories */}
          <nav className="hidden md:flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  currentCategory === category.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                      currentCategory === category.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate("/")} className="hover:text-blue-600 transition-colors">
              Inicio
            </button>
            <ChevronRight className="w-4 h-4" />
            {currentCategory !== "all" ? (
              <>
                <span className="text-gray-900">{categories.find((c) => c.id === currentCategory)?.name || "Productos"}</span>
              </>
            ) : (
              <span className="text-gray-900">Todos los productos</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">{children || <Outlet />}</div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">TechHub</span>
              </div>
              <p className="text-gray-400 text-sm">Tu destino para la mejor tecnología. Productos originales, precios increíbles y envío rápido.</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Compra</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    Cómo comprar
                  </span>
                </li>
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    Métodos de pago
                  </span>
                </li>
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    Envíos
                  </span>
                </li>
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    Devoluciones
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Ayuda</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    Centro de ayuda
                  </span>
                </li>
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    Garantías
                  </span>
                </li>
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    Contacto
                  </span>
                </li>
                <li>
                  <span href="#" className="hover:text-white transition-colors">
                    FAQ
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Síguenos</h5>
              <div className="flex gap-3 mb-4">
                <span href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all">
                  <span className="font-semibold">f</span>
                </span>
                <span href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all">
                  <span className="font-semibold">𝕏</span>
                </span>
                <span
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  <span className="font-semibold">in</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">Suscríbete a nuestro newsletter para ofertas exclusivas</p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-400">© 2026 TechHub. Todos los derechos reservados.</p>
            <p className="text-xs text-gray-500 mt-2">Dolores Hidalgo, Guanajuato, México</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
