import React from "react";

interface NavbarProps {
  setScreen: (screen: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setScreen }) => {
  return (
    <header className="h-16 bg-white border-b border-blue-100 px-8 flex items-center justify-between shadow-xs">
      <div className="font-bold text-lg text-blue-600 tracking-tight">
        Papelink
      </div>
      <button
        onClick={() => setScreen("login")}
        className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
      >
        Cerrar sesión
      </button>
    </header>
  );
};
