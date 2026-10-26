import React from "react";

export const Ventas: React.FC = () => {

  const salesHistory = [
    {    
      id: "V-00125",
      date: "14/10/2026",
      time: "13:06 h",
      itemsSummary: "3 cuadernos, 2 tijeras",
      itemCount: 5,
      total: 185.0,
      status: "Completada",
    },
    {
      id: "V-00124",
      date: "14/10/2026",
      time: "12:24 h",
      itemsSummary: "6 carpetas, 2 lápices",
      itemCount: 8,
      total: 120.0,
      status: "Completada",
    },
    {
      id: "V-00123",
      date: "14/10/2026",
      time: "11:47 h",
      itemsSummary: "12 pegamentos en barra",
      itemCount: 12,
      total: 264.0,
      status: "Completada",
    },
    {
      id: "V-00122",
      date: "14/10/2026",
      time: "10:32 h",
      itemsSummary: "3 tijeras escolares",
      itemCount: 3,
      total: 75.0,
      status: "Completada",
    },
    {
      id: "V-00121",
      date: "14/10/2026",
      time: "09:15 h",
      itemsSummary: "1 resma de papel, 5 lápices",
      itemCount: 6,
      total: 125.0,
      status: "Completada",
    },
  ];

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Consulta y registra las ventas de tu papelería.
          </p>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">
            Ventas de hoy
          </span>
          <span className="text-2xl font-bold text-gray-900">$1,248.00</span>
          <span className="text-[10px] text-gray-400 block mt-1">
            MXN - 14 de octubre de 2026
          </span>
        </div>
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">
            Ventas registradas
          </span>
          <span className="text-2xl font-bold text-gray-900">8</span>
          <span className="text-[10px] text-gray-400 block mt-1">
            52 artículos vendidos hoy
          </span>
        </div>
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">
            Ticket promedio
          </span>
          <span className="text-2xl font-bold text-gray-900">$156.00</span>
          <span className="text-[10px] text-gray-400 block mt-1">
            MXN por venta de hoy
          </span>
        </div>
      </div>

      {/* Contenedor Principal / Registro de Ventas */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-gray-900">
              Registro de ventas
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              14 de octubre de 2026 · Más recientes primero
            </p>
          </div>
        </div>

        {/* Inputs de Filtro */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Buscar venta
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar por identificador"
                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Desde
            </label>
            <input
              type="text"
              defaultValue="14/10/2026"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Hasta
            </label>
            <input
              type="text"
              defaultValue="14/10/2026"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[11px]">
              <th className="pb-3 font-medium">Identificador</th>
              <th className="pb-3 font-medium">Fecha</th>
              <th className="pb-3 font-medium">Artículos</th>
              <th className="pb-3 font-medium">Total (MXN)</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {salesHistory.map((s) => (
              <tr key={s.id} className="text-gray-800">
                <td className="py-3.5 font-bold text-gray-900">{s.id}</td>
                <td className="py-3.5 text-gray-500">
                  <div>{s.date}</div>
                  <div className="text-[10px] text-gray-400">{s.time}</div>
                </td>
                <td className="py-3.5">
                  <div className="font-medium text-gray-900">
                    {s.itemsSummary}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {s.itemCount} artículos
                  </div>
                </td>
                <td className="py-3.5 font-bold text-gray-900">
                  ${s.total.toFixed(2)}
                </td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-600 inline-block">
                    {s.status}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button className="text-xs text-gray-900 hover:underline font-medium">
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fila de Total del Período */}
        <div className="py-3 px-4 bg-gray-50 rounded-lg flex justify-between items-center text-xs font-bold text-gray-900 border border-gray-100">
          <span>Total del período · 8 ventas</span>
          <span>$1,248.00 MXN</span>
        </div>

        {/* Paginación */}
        <div className="pt-2 flex justify-between items-center text-xs text-gray-500">
          <span>Mostrando 8 de 8 ventas</span>
          <div className="flex items-center gap-2">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button className="border border-gray-200 rounded px-2 py-1 text-gray-400 hover:bg-gray-50">
                &lt;
              </button>
              <button className="border border-gray-200 rounded px-2 py-1 text-gray-400 hover:bg-gray-50">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
