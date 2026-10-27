import React, { useState } from "react";
import { Splash } from "./pages/splash";
import { Login } from "./pages/login";
import { InicioPOS } from "./pages/InicioPOS";
import { Inventario } from "./pages/inventario";
import { Ventas } from "./pages/ventas";
import { Pedidos } from "./pages/pedidos";
import { Sidebar } from "./components/sidebar";
import { EstadoNegocioModal } from "./components/modals/agregarventa";

export const App: React.FC = () => {
  const [screen, setScreen] = useState<"splash" | "login" | "dashboard">(
    "splash",
  );
  const [currentView, setCurrentView] = useState<string>("inicio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCobroOpen, setIsCobroOpen] = useState(false);

  // Carrito compartido de la pantalla de inicio
  const [cart, setCart] = useState([
    {
      id: "CUA-100R",
      name: "Cuaderno profesional",
      category: "Cuadernos",
      details: "Raya, 100 hojas",
      price: 45.0,
      qty: 4,
    },
    {
      id: "LAP-HB02",
      name: "Lápiz de grafito HB",
      category: "Escritura",
      details: "No. 2",
      price: 6.0,
      qty: 3,
    },
    {
      id: "MAR-12C",
      name: "Marcadores de colores",
      category: "Arte",
      details: "Estuche de 12 piezas",
      price: 68.0,
      qty: 1,
    },
    {
      id: "TIJ-13CM",
      name: "Tijeras escolares",
      category: "Escolar",
      details: "Punta redonda",
      price: 25.0,
      qty: 2,
    },
  ]);

  // Historial global de ventas
  const [salesList, setSalesList] = useState([
    {
      id: "V-00125",
      date: "14/10/2026",
      time: "13:06 h",
      itemsSummary: "3 cuadernos, 2 tijeras",
      itemCount: 5,
      total: 185.0,
      status: "Completada",
    },
    {
      id: "V-00124",
      date: "14/10/2026",
      time: "12:24 h",
      itemsSummary: "6 carpetas, 2 lápices",
      itemCount: 8,
      total: 120.0,
      status: "Completada",
    },
    {
      id: "V-00123",
      date: "14/10/2026",
      time: "11:47 h",
      itemsSummary: "12 pegamentos en barra",
      itemCount: 12,
      total: 264.0,
      status: "Completada",
    },
  ]);

  // Cálculos dinámicos basados en el carrito actual
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleConfirmSale = () => {
    if (cart.length === 0) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeStr =
      now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) +
      " h";

    const summary = cart
      .map((i) => `${i.qty} ${i.name.toLowerCase()}`)
      .join(", ");

    const newSale = {
      id: `V-00${126 + salesList.length}`,
      date: dateStr,
      time: timeStr,
      itemsSummary: summary,
      itemCount: totalItems,
      total: totalAmount,
      status: "Completada",
    };

    setSalesList([newSale, ...salesList]);
    setCart([]); // Vacía el carrito de la pantalla inicio al finalizar el pago
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
          onClick={() => setScreen("login")}
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
              onOpenCobro={() => setIsCobroOpen(true)}
            />
          )}
          {currentView === "inventario" && (
            <Inventario onOpenAgregarProducto={() => {}} />
          )}
          {currentView === "ventas" && <Ventas />}
          {currentView === "pedidos" && <Pedidos />}
        </main>
      </div>

      <EstadoNegocioModal
        isOpen={isCobroOpen}
        onClose={() => setIsCobroOpen(false)}
        totalAmount={totalAmount}
        totalItems={totalItems}
        onConfirmSale={handleConfirmSale}
      />
    </div>
  );
};

export default App;
