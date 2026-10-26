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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4 select-none">
      <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3 px-3">
        ADMINISTRACIÓN
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              currentView === item.id
                ? 'bg-gray-100 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};