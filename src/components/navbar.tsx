import React from 'react';

interface NavbarProps {
  setScreen: (screen: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setScreen }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="font-bold text-lg text-gray-800 tracking-wide">PapeLink</div>
      <button 
    onClick={() => setScreen('login')}
    className="text-xs text-gray-500 hover:text-gray-800 font-medium underline"
  >
    Cerrar sesión
  </button>
    </header>
  );
};