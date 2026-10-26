import React, { useState } from 'react';

export const Ventas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hoy' | 'semana' | 'mes'>('hoy');

  const salesHistory = [
    { id: 'V-00125', date: '14/10/2026', time: '13:06 h', itemsSummary: '3 cuadernos, 2 tijeras', itemCount: 5, total: 185.00, status: 'Completada' },
    { id: 'V-00124', date: '14/10/2026', time: '12:24 h', itemsSummary: '6 carpetas, 2 lápices', itemCount: 8, total: 120.00, status: 'Completada' },
    { id: 'V-00123', date: '14/10/2026', time: '11:47 h', itemsSummary: '12 pegamentos en barra', itemCount: 12, total: 264.00, status: 'Completada' },
    { id: 'V-00122', date: '14/10/2026', time: '10:32 h', itemsSummary: '3 tijeras escolares', itemCount: 3, total: 75.00, status: 'Completada' },
    { id: 'V-00121', date: '14/10/2026', time: '09:15 h', itemsSummary: '1 resma de papel, 5 lápices', itemCount: 6, total: 125.00, status: 'Completada' },
  ];

  return (
    <div className="p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Ventas</h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">Consulta y registra las ventas de tu papelería.</p>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ventas de hoy</span>
          <span className="text-2xl font-extrabold text-slate-900">$1,248.00</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">MXN · 14 de octubre de 2026</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ventas registradas</span>
          <span className="text-2xl font-extrabold text-slate-900">8</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">52 artículos vendidos hoy</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ticket promedio</span>
          <span className="text-2xl font-extrabold text-slate-900">$156.00</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">MXN por venta de hoy</span>
        </div>
      </div>

      {/* Registro de Ventas */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Registro de ventas</h3>
            <p className="text-[10px] text-sky-700 font-medium mt-0.5">14 de octubre de 2026 · Más recientes primero</p>
          </div>
          
          {/* Pestañas Celestes */}
          <div className="bg-sky-50/80 p-1 rounded-xl flex text-xs border border-sky-200/60">
            <button
              onClick={() => setActiveTab('hoy')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${activeTab === 'hoy' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'}`}
            >
              Hoy
            </button>
            <button
              onClick={() => setActiveTab('semana')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${activeTab === 'semana' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'}`}
            >
              Esta semana
            </button>
            <button
              onClick={() => setActiveTab('mes')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${activeTab === 'mes' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'}`}
            >
              Este mes
            </button>
          </div>
        </div>

        {/* Inputs de Filtro */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar venta</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sky-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar por identificador"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Desde</label>
            <input
              type="text"
              defaultValue="14/10/2026"
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hasta</label>
            <input
              type="text"
              defaultValue="14/10/2026"
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
              <th className="pb-3">Identificador</th>
              <th className="pb-3">Fecha</th>
              <th className="pb-3">Artículos</th>
              <th className="pb-3">Total (MXN)</th>
              <th className="pb-3">Estado</th>
              <th className="pb-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-50">
            {salesHistory.map((s) => (
              <tr key={s.id} className="text-slate-800 hover:bg-sky-50/50 transition">
                <td className="py-3.5 font-bold text-sky-700">{s.id}</td>
                <td className="py-3.5 text-slate-500">
                  <div>{s.date}</div>
                  <div className="text-[10px] text-slate-400">{s.time}</div>
                </td>
                <td className="py-3.5">
                  <div className="font-bold text-slate-900">{s.itemsSummary}</div>
                  <div className="text-[10px] text-slate-500">{s.itemCount} artículos</div>
                </td>
                <td className="py-3.5 font-bold text-slate-900">${s.total.toFixed(2)}</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 inline-block">
                    {s.status}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer">
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Resumen Total */}
        <div className="py-3 px-4 bg-gradient-to-r from-sky-100/70 to-sky-50/80 rounded-xl flex justify-between items-center text-xs font-extrabold text-sky-900 border border-sky-200/80">
          <span>Total del período · 8 ventas</span>
          <span>$1,248.00 MXN</span>
        </div>

        {/* Paginación */}
        <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
          <span>Mostrando 8 de 8 ventas</span>
          <div className="flex items-center gap-2">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&lt;</button>
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};