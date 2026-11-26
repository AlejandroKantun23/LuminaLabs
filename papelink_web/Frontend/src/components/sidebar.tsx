import React, { useEffect } from "react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  pendingOrdersCount?: number;
}

const MENU_ITEMS = [
  { id: "inicio", keyLabel: "F1", label: "Ventas" },
  { id: "pedidos", keyLabel: "F2", label: "Pedidos Móvil" },
  { id: "inventario", keyLabel: "F3", label: "Inventario" },
  { id: "corte", keyLabel: "F4", label: "Corte de Caja" },
  { id: "ventas", keyLabel: "F5", label: "Ventas del Día" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  onClose,
  pendingOrdersCount = 0,
}) => {
  // Atajos globales F1 - F5 estilo Eleventa
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        F1: "inicio",
        F2: "pedidos",
        F3: "inventario",
        F4: "corte",
        F5: "ventas",
      };
      const target = map[e.key];
      if (target) {
        e.preventDefault();
        setCurrentView(target);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCurrentView]);

  return (
    <nav
      aria-label="Navegación principal POS"
      className="w-full bg-slate-100 border-b border-slate-200 px-3 sm:px-6 py-2 select-none"
    >
      <div className="flex items-center gap-2 overflow-x-auto">
        {MENU_ITEMS.map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCurrentView(item.id);
                onClose?.();
              }}
              className={`flex items-center gap-2 whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                active
                  ? "bg-white text-sky-700 border-sky-500 shadow-xs ring-1 ring-sky-500/20"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-sky-300 hover:text-sky-700"
              }`}
            >
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                  active
                    ? "bg-sky-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {item.keyLabel}
              </span>
              <span>{item.label}</span>
              {item.id === "pedidos" && pendingOrdersCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold leading-none">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};