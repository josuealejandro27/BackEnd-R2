import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { BankSelector, BANKS } from "../../../components/BankSelector";
import { Layout } from "../../../layouts/Layout";
import { CartItem } from "../../../components/ShoppingCart";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState<string>(BANKS[0].id);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    // Recuperar datos del sessionStorage
    const storedItems = sessionStorage.getItem("cartItems");
    const storedTotal = sessionStorage.getItem("cartTotal");

    if (!storedItems || !storedTotal) {
      // Si no hay datos, redirigir a productos
      navigate("/products");
      return;
    }

    setCartItems(JSON.parse(storedItems));
    setTotalAmount(parseFloat(storedTotal));
  }, [navigate]);

  const handleCalculate = () => {
    if (totalAmount < 5000) {
      alert("El monto debe ser mayor o igual a $5,000.00");
      return;
    }

    // Guardar selección del banco
    sessionStorage.setItem("selectedBank", selectedBank);
    sessionStorage.setItem("purchaseDate", new Date().toISOString());

    // Navegar a la página de plan de pagos
    navigate("/payment-plan");
  };

  const handleBackToProducts = () => {
    navigate("/products");
  };

  return (
    <Layout cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="light"
            onPress={handleBackToProducts}
            startContent={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Checkout - Pagos Diferidos</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resumen de compra */}
          <div>
            <Card className="w-full">
              <CardHeader>
                <p className="text-lg font-semibold">Resumen de Compra</p>
              </CardHeader>
              <Divider />
              <CardBody className="gap-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-default-500">
                          ${item.price.toLocaleString("es-MX")} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      $
                      {(item.price * item.quantity).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))}
                <Divider />
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xl font-bold">Total:</p>
                  <p className="text-2xl font-bold text-primary">
                    $
                    {totalAmount.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Selector de banco */}
          <div>
            <BankSelector selectedBank={selectedBank} onBankChange={setSelectedBank} totalAmount={totalAmount} />

            {totalAmount >= 5000 && (
              <Button color="success" size="lg" className="w-full mt-6" onPress={handleCalculate}>
                Calcular Plan de Pagos
              </Button>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <Card className="mt-6">
          <CardBody>
            <h3 className="font-semibold mb-2">Información Importante:</h3>
            <ul className="list-disc list-inside text-sm text-default-600 space-y-1">
              <li>El monto mínimo para pagos diferidos es de $5,000.00</li>
              <li>La tasa de interés se aplicará sobre el monto total de compra</li>
              <li>Los pagos inician al mes siguiente de la fecha de compra</li>
              <li>El plan de pagos se genera automáticamente según el banco seleccionado</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};
