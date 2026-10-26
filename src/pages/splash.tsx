import React, { useEffect } from "react";

interface Props {
  onFinish: () => void;
}

export const SplashPage: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200); // Tiempo de duración del splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF2F8] via-white to-[#E0F2FE] flex flex-col items-center justify-center p-4 select-none">
      <div className="text-center space-y-4">
        {/* Icono de la Papelería / Sistema con fondo azul formal */}
        <div className="w-20 h-20 bg-sky-600 rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-sky-200">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        {/* Título de la App */}
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Papelink
        </h1>
        <p className="text-xs text-sky-700 font-bold tracking-wider uppercase">
          Lumina Labs · Sistema POS
        </p>

        {/* Barra de carga sutil */}
        <div className="pt-6">
          <div className="w-32 h-1.5 bg-sky-100 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-sky-600 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
