import React, { useState } from "react";

export const Ventas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"hoy" | "semana" | "mes">("hoy");

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

  const tabs: { id: "hoy" | "semana" | "mes"; label: string }[] = [
    { id: "hoy", label: "Hoy" },
    { id: "semana", label: "Esta semana" },
    { id: "mes", label: "Este mes" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Ventas
        </h1>
        <p className="text-xs text-sky-700 font-semibold mt-0.5">
          Consulta y registra las ventas de tu papelería.
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ventas de hoy
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            $1,248.00
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            MXN · 14 de octubre de 2026
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ventas registradas
          </span>
          <span className="text-2xl font-extrabold text-slate-900">8</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            52 artículos vendidos hoy
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ticket promedio
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            $156.00
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            MXN por venta de hoy
          </span>
        </div>
      </div>

      {/* Registro de Ventas */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h2 className="font-bold text-sm text-slate-900">
              Registro de ventas
            </h2>
            <p className="text-[10px] text-sky-700 font-medium mt-0.5">
              14 de octubre de 2026 · Más recientes primero
            </p>
          </div>

          {/* Pestañas */}
          <div className="bg-sky-50/80 p-1 rounded-xl flex text-xs border border-sky-200/60 w-full sm:w-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                aria-pressed={activeTab === t.id}
                className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg font-bold transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                  activeTab === t.id
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-sky-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs de Filtro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="ventas-buscar"
              className="block text-[11px] font-semibold text-slate-700 mb-1"
            >
              Buscar venta
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sky-500" aria-hidden="true">
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
                id="ventas-buscar"
                type="text"
                placeholder="Buscar por identificador"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="ventas-desde"
              className="block text-[11px] font-semibold text-slate-700 mb-1"
            >
              Desde
            </label>
            <input
              id="ventas-desde"
              type="text"
              defaultValue="14/10/2026"
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300"
            />
          </div>
          <div>
            <label
              htmlFor="ventas-hasta"
              className="block text-[11px] font-semibold text-slate-700 mb-1"
            >
              Hasta
            </label>
            <input
              id="ventas-hasta"
              type="text"
              defaultValue="14/10/2026"
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300"
            />
          </div>
        </div>

        {/* ===== CELULAR / TABLETA: tarjetas (hasta 1024 px) ===== */}
        <ul className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3">
          {salesHistory.map((s) => (
            <li
              key={s.id}
              className="border border-sky-100 rounded-xl p-4 bg-sky-50/30"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-sky-700 text-sm">{s.id}</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${s.total.toFixed(2)}
                </span>
              </div>

              <div className="mt-2">
                <div className="font-bold text-slate-900 text-xs break-words">
                  {s.itemsSummary}
                </div>
                <div className="text-[10px] text-slate-500">
                  {s.itemCount} artículos
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  {s.date}
                  <span className="block text-[10px] text-slate-400">
                    {s.time}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 inline-block">
                  {s.status}
                </span>
              </div>

              <button
                aria-label={`Ver detalle de la venta ${s.id}`}
                className="mt-4 w-full border border-sky-200 rounded-lg py-2.5 text-xs text-sky-700 font-semibold hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Ver detalle
              </button>
            </li>
          ))}
        </ul>

        {/* ===== LAPTOP: tabla (desde 1024 px) ===== */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                <th scope="col" className="pb-3 pr-3">Identificador</th>
                <th scope="col" className="pb-3 pr-3">Fecha</th>
                <th scope="col" className="pb-3 pr-3">Artículos</th>
                <th scope="col" className="pb-3 pr-3">Total (MXN)</th>
                <th scope="col" className="pb-3 pr-3">Estado</th>
                <th scope="col" className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {salesHistory.map((s) => (
                <tr
                  key={s.id}
                  className="text-slate-800 hover:bg-sky-50/50 transition"
                >
                  <td className="py-3.5 pr-3 font-bold text-sky-700">{s.id}</td>
                  <td className="py-3.5 pr-3 text-slate-500">
                    <div>{s.date}</div>
                    <div className="text-[10px] text-slate-400">{s.time}</div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="font-bold text-slate-900">
                      {s.itemsSummary}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {s.itemCount} artículos
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-bold text-slate-900">
                    ${s.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 inline-block">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      aria-label={`Ver detalle de la venta ${s.id}`}
                      className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen Total */}
        <div className="py-3 px-4 bg-gradient-to-r from-sky-100/70 to-sky-50/80 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs font-extrabold text-sky-900 border border-sky-200/80">
          <span>Total del período · 8 ventas</span>
          <span>$1,248.00 MXN</span>
        </div>

        {/* Paginación */}
        <div className="pt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-slate-500">
          <span>Mostrando 8 de 8 ventas</span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button
                aria-label="Página anterior"
                className="border border-sky-200 rounded-lg px-3 py-1.5 text-sky-700 hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                &lt;
              </button>
              <button
                aria-label="Página siguiente"
                className="border border-sky-200 rounded-lg px-3 py-1.5 text-sky-700 hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};