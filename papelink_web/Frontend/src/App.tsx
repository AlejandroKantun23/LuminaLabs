import React, { useState } from "react";
import { crearVenta, setToken } from "./api/client";
import type { ProductoApi } from "./api/client";
import { Splash } from "./pages/splash";
import { Login } from "./pages/login";
import { InicioPOS } from "./pages/InicioPOS";
import type { CartItem } from "./pages/InicioPOS";
import { Inventario } from "./pages/inventario";
import { Ventas } from "./pages/ventas";
import { Pedidos } from "./pages/pedidos";
import { Sidebar } from "./components/sidebar";
import { EstadoNegocioModal } from "./components/modals/agregarventa";
import { EstadoInventarioModal } from "./components/modals/agregarinventario";

export const App: React.FC = () => {
  const [screen, setScreen] = useState<"splash" | "login" | "dashboard">(
    "splash",
  );
  const [currentView, setCurrentView] = useState<string>("inicio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCobroOpen, setIsCobroOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [inventoryProduct, setInventoryProduct] = useState<ProductoApi | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saleError, setSaleError] = useState("");
  const [isSaleSubmitting, setIsSaleSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleConfirmSale = async () => {
    if (!cart.length || isSaleSubmitting) return false;
    setSaleError("");
    setIsSaleSubmitting(true);
    try {
      await crearVenta(
        cart.map((item) => ({
          producto_id: item.productId,
          cantidad: item.qty,
        })),
        "efectivo",
      );
      setCart([]);
      setRefreshKey((key) => key + 1);
      return true;
    } catch (requestError) {
      setSaleError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo registrar la venta.",
      );
      return false;
    } finally {
      setIsSaleSubmitting(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCart([]);
    setScreen("login");
  };

  if (screen === "splash")
    return <Splash onFinish={() => setScreen("login")} />;
  if (screen === "login")
    return (
      <Login
        onLogin={() => {
          setScreen("dashboard");
          setCurrentView("inicio");
        }}
      />
    );

  return (
    <div className="min-h-screen bg-[#EAF2F8] flex flex-col font-sans select-none">
      <header className="h-16 bg-white border-b border-sky-100 px-4 lg:px-8 flex items-center justify-between shadow-xs z-50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Abrir menú"
            className="lg:hidden p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="font-bold text-lg text-sky-600 tracking-tight">
            Papelink
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-sky-600 hover:text-sky-800 font-semibold underline cursor-pointer"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 bg-[#EAF2F8] overflow-y-auto w-full p-4 md:p-8">
          {currentView === "inicio" && (
            <InicioPOS
              cart={cart}
              setCart={setCart}
              onOpenCobro={() => {
                setSaleError("");
                setIsCobroOpen(true);
              }}
              refreshKey={refreshKey}
            />
          )}
          {currentView === "inventario" && (
            <Inventario
              onOpenAgregarProducto={() => {
                setInventoryProduct(null);
                setIsInventoryModalOpen(true);
              }}
              onEditProducto={(product) => {
                setInventoryProduct(product);
                setIsInventoryModalOpen(true);
              }}
              refreshKey={refreshKey}
            />
          )}
          {currentView === "ventas" && <Ventas refreshKey={refreshKey} />}
          {currentView === "pedidos" && <Pedidos refreshKey={refreshKey} />}
        </main>
      </div>

      <EstadoNegocioModal
        isOpen={isCobroOpen}
        onClose={() => setIsCobroOpen(false)}
        totalAmount={totalAmount}
        totalItems={totalItems}
        onConfirmSale={handleConfirmSale}
        error={saleError}
        isSubmitting={isSaleSubmitting}
      />

      {isInventoryModalOpen && (
        <EstadoInventarioModal
          key={inventoryProduct?.id ?? "new-product"}
          isOpen
          product={inventoryProduct}
          onClose={() => {
            setIsInventoryModalOpen(false);
            setInventoryProduct(null);
          }}
          onCreated={() => {
            setIsInventoryModalOpen(false);
            setInventoryProduct(null);
            setRefreshKey((key) => key + 1);
          }}
        />
      )}
    </div>
  );
};

export default App;
