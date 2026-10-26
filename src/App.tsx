import React, { useState } from 'react';
import { Splash } from './pages/splash';
import { Login } from './pages/login';
import { Navbar } from './components/navbar';
import { Sidebar } from './components/sidebar';
import { InicioPOS as Inicio } from './pages/InicioPOS';
import { Inventario } from './pages/inventario';
import { Ventas } from './pages/ventas';
import { EstadoNegocioModal } from './components/modals/agregarventa';
import { EstadoInventarioModal } from './components/modals/agregarinventario';
import { Pedidos } from './pages/pedidos';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [currentView, setCurrentView] = useState<string>('Inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // menú lateral en celular

  // Control de Modales
  const [isCobroOpen, setIsCobroOpen] = useState(false);
  const [isAgregarProductoOpen, setIsAgregarProductoOpen] = useState(false);

  if (screen === 'splash') {
    return <Splash onFinish={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return <Login onLogin={() => {
      setScreen('dashboard');
      setCurrentView('inicio'); // Garantiza redirigir al Inicio
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        setScreen={(nextScreen) => {
          if (nextScreen === 'splash' || nextScreen === 'login' || nextScreen === 'dashboard') {
            setScreen(nextScreen);
          }
        }}
      />
      <div className="flex flex-1">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
        <main className="flex-1 min-w-0 bg-gray-50 overflow-y-auto">
          {currentView === 'inicio' && (
            <Inicio onOpenCobro={() => setIsCobroOpen(true)} />
          )}
          {currentView === 'inventario' && (
            <Inventario onOpenAgregarProducto={() => setIsAgregarProductoOpen(true)} />
          )}
          {currentView === 'ventas' && <Ventas />}

          {currentView === 'pedidos' && <Pedidos />}
        </main>
      </div>

      {/* Modales */}
      <EstadoNegocioModal
        isOpen={isCobroOpen}
        onClose={() => setIsCobroOpen(false)}
        totalAmount={140.0}
        totalItems={10}
        onConfirmSale={() => alert('¡Venta realizada con éxito!')}
      />

      <EstadoInventarioModal
        isOpen={isAgregarProductoOpen}
        onClose={() => setIsAgregarProductoOpen(false)}
      />
    </div>
  );
};

export default App;