import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { ProductsPage } from "../modules/Productos/pages/Products";
import { CartPage } from "../modules/Carrito/pages/Cart";
import { ResultPage } from "../modules/Pago/pages/Result";
import { PaymentPage } from "@modules/Pago/pages/PaymentPlan";

export const IndexRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductsPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="pago" element={<PaymentPage />} />
        <Route path="resultado" element={<ResultPage />} />
      </Route>
    </Routes>
  );
};
