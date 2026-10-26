import React from "react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
}) => {
  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "inventario", label: "Inventario" },
    { id: "ventas", label: "Ventas" },
    { id: "pedidos", label: "Pedidos" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-blue-100 min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-3 px-3">
        ADMINISTRACIÓN
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentView === item.id
                ? "bg-blue-50 text-blue-700 shadow-xs border-l-4 border-blue-600"
                : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
