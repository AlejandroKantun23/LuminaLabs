import React from 'react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'inventario', label: 'Inventario' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'pedidos', label: 'Pedidos' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-sky-100 p-4 select-none shrink-0">
      <div className="text-[10px] font-extrabold tracking-widest text-sky-600 uppercase mb-3 px-3 hidden md:block">
        ADMINISTRACIÓN
      </div>
      <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`whitespace-nowrap md:whitespace-normal text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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