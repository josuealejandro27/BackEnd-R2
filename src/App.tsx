// src/App.tsx
import { CartProvider } from "./context/CartContext";
import { IndexRoutes } from "./routes/IndexRoutes";

function App() {
  return (
    <CartProvider>
      <IndexRoutes />
    </CartProvider>
  );
}

export default App;