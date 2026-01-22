import { Product } from "../types";

export const PRODUCTS: Product[] = [
  { id: 1, name: "iPhone 15 Pro Max", price: 25999, image: "📱", description: "256GB - Titanio Natural" },
  { id: 2, name: "MacBook Air M2", price: 22999, image: "💻", description: '13" - 8GB RAM - 256GB SSD' },
  { id: 3, name: 'iPad Pro 12.9"', price: 18999, image: "📲", description: "128GB - Wi-Fi - Gris Espacial" },
  { id: 4, name: "AirPods Pro", price: 5499, image: "🎧", description: "2da Generación con MagSafe" },
  { id: 5, name: "Apple Watch Ultra 2", price: 16999, image: "⌚", description: "GPS + Cellular - 49mm" },
  { id: 6, name: "Sony PS5", price: 12999, image: "🎮", description: "Digital Edition - 825GB" },
  { id: 7, name: 'Samsung Smart TV 65"', price: 15999, image: "📺", description: "QLED 4K - Quantum HDR" },
  { id: 8, name: "Canon EOS R6", price: 45999, image: "📷", description: "Cuerpo - Sensor Full Frame" },
];

export const BANKS_CONFIG = [
  {
    id: "banco1",
    name: "Banco1",
    months: 9,
    rate: 8,
    color: "from-blue-500 to-blue-700",
    icon: "🏦",
  },
  {
    id: "banco2",
    name: "Banco2",
    months: 12,
    rate: 10,
    color: "from-green-500 to-green-700",
    icon: "💳",
  },
  {
    id: "banco3",
    name: "Banco3",
    months: 18,
    rate: 13,
    color: "from-purple-500 to-purple-700",
    icon: "🎫",
  },
];
