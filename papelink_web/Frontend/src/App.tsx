import React, { useEffect, useState } from "react";
import { crearVenta, getResumenDia, setToken } from "./api/client";
import type { Metodo, Usuario } from "./api/client";
import { Splash } from "./pages/splash";
import { Login } from "./pages/login";
import { InicioPOS } from "./pages/InicioPOS";
import type { CartItem } from "./pages/InicioPOS";
import { Inventario } from "./pages/inventario";
import { Ventas } from "./pages/ventas";
import { Pedidos } from "./pages/pedidos";
import { CorteCaja } from "./pages/Corte";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { EstadoNegocioModal } from "./components/modals/agregarventa";

export const App: React.FC = () => {
  const [screen, setScreen] = useState<"splash" | "login" | "dashboard">(
    "splash",
  );
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [currentView, setCurrentView] = useState<string>("inicio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCobroOpen, setIsCobroOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saleError, setSaleError] = useState("");
  const [isSaleSubmitting, setIsSaleSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  // Actualizar el contador de pedidos activos de la app móvil en la pestaña F2
  useEffect(() => {
    if (screen !== "dashboard") return;
    let active = true;
    getResumenDia()
      .then((summary) => {
        if (!active) return;
        const estados = summary.pedidos_por_estado ?? {};
        const activos =
          Number(estados.pendiente ?? 0) +
          Number(estados.confirmado_apartado ?? 0) +
          Number(estados.listo_en_tienda ?? 0);
        setPendingOrdersCount(activos);
      })
      .catch(() => {
        // Silencioso para no interrumpir la operación en caja
      });
    return () => {
      active = false;
    };
  }, [screen, refreshKey, currentView]);

  const handleConfirmSale = async (metodo: Metodo) => {
    if (!cart.length || isSaleSubmitting) return false;
    setSaleError("");
    setIsSaleSubmitting(true);
    try {
      await crearVenta(
        cart.map((item) => ({
          producto_id: item.productId,
          cantidad: item.qty,
        })),
        metodo,
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
    setCurrentUser(null);
    setCart([]);
    setIsCobroOpen(false);
    setScreen("login");
  };

  if (screen === "splash") {
    return <Splash onFinish={() => setScreen("login")} />;
  }

  if (screen === "login") {
    return (
      <Login
        onLogin={(user) => {
          setCurrentUser(user);
          setScreen("dashboard");
          setCurrentView("inicio");
          setRefreshKey((key) => key + 1);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF2F8] flex flex-col font-sans select-none">
      {/* Barra superior azul estilo Eleventa */}
      <Navbar
        setScreen={handleLogout}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        isMenuOpen={isMenuOpen}
        userName={
          currentUser
            ? `${currentUser.nombre} (${currentUser.rol})`
            : "Caja Principal"
        }
      />

      {/* Cinta horizontal de navegación F1 - F5 */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Área de trabajo principal */}
      <main className="flex-1 overflow-y-auto w-full max-w-[1440px] mx-auto p-4 sm:p-6">
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

        {currentView === "pedidos" && (
          <Pedidos
            refreshKey={refreshKey}
            onOrderChanged={() => setRefreshKey((key) => key + 1)}
          />
        )}

        {currentView === "inventario" && (
          <Inventario
            refreshKey={refreshKey}
            onInventoryChanged={() => setRefreshKey((key) => key + 1)}
          />
        )}

        {currentView === "corte" && <CorteCaja refreshKey={refreshKey} />}

        {currentView === "ventas" && <Ventas refreshKey={refreshKey} />}
      </main>

      {/* Modal de cobro F12 */}
      <EstadoNegocioModal
        isOpen={isCobroOpen}
        onClose={() => setIsCobroOpen(false)}
        totalAmount={totalAmount}
        totalItems={totalItems}
        onConfirmSale={handleConfirmSale}
        error={saleError}
        isSubmitting={isSaleSubmitting}
      />
    </div>
  );
};

export default App;