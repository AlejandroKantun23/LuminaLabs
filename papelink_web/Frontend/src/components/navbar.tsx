import React from "react";

interface NavbarProps {
  setScreen: (screen: string) => void;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  setScreen,
  onToggleMenu,
  isMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-blue-100 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa: solo visible en celular y tableta */}
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={isMenuOpen}
          aria-controls="menu-lateral"
          className="lg:hidden p-2 -ml-2 rounded-lg text-blue-600 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="font-bold text-lg text-blue-600 tracking-tight">
          Papelink
        </div>
      </div>

      <button
        onClick={() => setScreen("login")}
        className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
      >
        Cerrar sesión
      </button>
    </header>
  );
};