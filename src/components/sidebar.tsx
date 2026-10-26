import React from 'react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'inventario', label: 'Inventario' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'pedidos', label: 'Pedidos' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-sky-100 min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="text-[10px] font-extrabold tracking-widest text-sky-600 uppercase mb-3 px-3">
        ADMINISTRACIÓN
      </div>
      <nav className="space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === item.id
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};