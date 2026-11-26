import React, { useEffect, useState } from "react";

interface NavbarProps {
  setScreen: (screen: string) => void;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  setScreen,
  onToggleMenu,
  isMenuOpen,
  userName = "Caja Principal",
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const fechaTexto = now.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const horaTexto = now.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <header className="sticky top-0 z-40 h-14 bg-sky-700 text-white px-4 sm:px-6 flex items-center justify-between shadow-sm select-none">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          className="md:hidden p-1.5 -ml-1 rounded-lg text-white hover:bg-sky-600 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 6l12 12M18 6L6 18"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white text-sky-700 font-black text-sm flex items-center justify-center shadow-xs">
            P
          </div>
          <div>
            <div className="font-extrabold text-sm leading-tight tracking-tight">
              Papelink
            </div>
            <div className="text-[10px] text-sky-100 font-medium leading-tight">
              Punto de Venta
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 text-xs bg-sky-800/70 px-3 py-1.5 rounded-lg border border-sky-600/60">
          <span className="font-semibold text-sky-100">{userName}</span>
          <span className="text-sky-400">|</span>
          <span className="font-mono text-white">
            {fechaTexto} · {horaTexto}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setScreen("login")}
          className="text-xs bg-sky-800 hover:bg-sky-900 border border-sky-500/50 text-white font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};