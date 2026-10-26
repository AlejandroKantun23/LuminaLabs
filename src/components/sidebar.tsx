import React from "react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "inventario", label: "Inventario" },
    { id: "ventas", label: "Ventas" },
    { id: "pedidos", label: "Pedidos" },
  ];

  const handleSelect = (id: string) => {
    setCurrentView(id);
    onClose(); // en celular, cierra el menú al elegir una opción
  };

  return (
    <>
      {/* Fondo oscuro detrás del menú (solo celular/tableta) */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="menu-lateral"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-sky-100 p-4 select-none overflow-y-auto transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0 lg:visible lg:min-h-[calc(100vh-4rem)] lg:shrink-0
          ${isOpen ? "translate-x-0 shadow-xl lg:shadow-none" : "-translate-x-full invisible"}`}
      >
        <div className="text-[10px] font-extrabold tracking-widest text-sky-600 uppercase mb-3 px-3">
          ADMINISTRACIÓN
        </div>
        <nav aria-label="Navegación principal" className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              aria-current={currentView === item.id ? "page" : undefined}
              className={`w-full text-left px-3.5 py-3 lg:py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                currentView === item.id
                  ? "bg-sky-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};