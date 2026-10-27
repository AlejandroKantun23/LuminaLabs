import React, { useState } from 'react';
import { Splash } from './pages/splash';
import { Login } from './pages/login';
import { InicioPOS } from './pages/InicioPOS';
import { Inventario } from './pages/inventario';
import { Ventas } from './pages/ventas';
import { Pedidos } from './pages/pedidos';
import { Sidebar } from './components/sidebar';
import { EstadoNegocioModal } from './components/modals/agregarventa';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [currentView, setCurrentView] = useState<string>('inicio');

  // Control del modal de cobro / pago
  const [isCobroOpen, setIsCobroOpen] = useState(false);

  // Historial global de ventas sincronizado
  const [salesList, setSalesList] = useState([
    { id: 'V-00125', date: '14/10/2026', time: '13:06 h', itemsSummary: '3 cuadernos, 2 tijeras', itemCount: 5, total: 185.00, status: 'Completada' },
    { id: 'V-00124', date: '14/10/2026', time: '12:24 h', itemsSummary: '6 carpetas, 2 lápices', itemCount: 8, total: 120.00, status: 'Completada' },
    { id: 'V-00123', date: '14/10/2026', time: '11:47 h', itemsSummary: '12 pegamentos en barra', itemCount: 12, total: 264.00, status: 'Completada' },
    { id: 'V-00122', date: '14/10/2026', time: '10:32 h', itemsSummary: '3 tijeras escolares', itemCount: 3, total: 75.00, status: 'Completada' },
    { id: 'V-00121', date: '14/10/2026', time: '09:15 h', itemsSummary: '1 resma de papel, 5 lápices', itemCount: 6, total: 125.00, status: 'Completada' },
  ]);

  // Carrito temporal para el proceso de cobro
  const [currentCartForCheckout, setCurrentCartForCheckout] = useState<{ items: any[]; total: number; count: number }>({
    items: [],
    total: 0,
    count: 0
  });

  const handleOpenCobroWithCart = (cartItems: any[]) => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const count = cartItems.reduce((acc, item) => acc + item.qty, 0);

    setCurrentCartForCheckout({
      items: cartItems,
      total: total > 0 ? total : 140.0,
      count: count > 0 ? count : 10
    });
    setIsCobroOpen(true);
  };

  const handleConfirmSale = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) + ' h';
    
    const summary = currentCartForCheckout.items.length > 0
      ? currentCartForCheckout.items.map((i: any) => `${i.qty} ${i.name.toLowerCase()}`).join(', ')
      : 'Venta general de mostrador';

    const newSale = {
      id: `V-00${126 + salesList.length}`,
      date: dateStr,
      time: timeStr,
      itemsSummary: summary,
      itemCount: currentCartForCheckout.count,
      total: currentCartForCheckout.total,
      status: 'Completada'
    };

    setSalesList([newSale, ...salesList]);
  };

  if (screen === 'splash') {
    return <Splash onFinish={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return <Login onLogin={() => {
      setScreen('dashboard');
      setCurrentView('inicio');
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
      {/* Cabecera Superior */}
      <header className="h-16 bg-white border-b border-sky-100 px-8 flex items-center justify-between shadow-xs">
        <div className="font-bold text-lg text-sky-600 tracking-tight">Papelink</div>
        <button 
          onClick={() => setScreen('login')}
          className="text-xs text-sky-600 hover:text-sky-800 font-semibold underline cursor-pointer"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenedor Principal con Sidebar y Vistas */}
      <div className="flex flex-1">
  {/* Ajusta las props que recibe el Sidebar según lo que requiera tu componente en src/components/sidebar.tsx */}
  <Sidebar 
    currentView={currentView} 
    setCurrentView={setCurrentView} 
    isOpen={true} 
    onClose={() => {}} 
  />
  
  <main className="flex-1 bg-[#EAF2F8] overflow-y-auto">
    {currentView === 'inicio' && (
      <InicioPOS onOpenCobro={() => handleOpenCobroWithCart([])} />
    )}
    {currentView === 'inventario' && (
      <Inventario onOpenAgregarProducto={() => {}} />
    )}
    {currentView === 'ventas' && (
      <Ventas salesList={salesList} />
    )}
    {currentView === 'pedidos' && (
      <Pedidos />
    )}
  </main>
</div>

      {/* Modal de Cobro */}
      <EstadoNegocioModal
        isOpen={isCobroOpen}
        onClose={() => setIsCobroOpen(false)}
        totalAmount={currentCartForCheckout.total}
        totalItems={currentCartForCheckout.count}
        onConfirmSale={handleConfirmSale}
      />
    </div>
  );
};

export default App;