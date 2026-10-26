import React from 'react';

export const Ventas: React.FC = () => {
  const salesHistory = [
    { id: 'TK-1001', time: '10:15 AM', items: 3, total: 140.0, method: 'Efectivo' },
    { id: 'TK-1002', time: '11:40 AM', items: 1, total: 35.0, method: 'Efectivo' },
    { id: 'TK-1003', time: '01:10 PM', items: 8, total: 420.0, method: 'Tarjeta' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Ventas</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
          <span className="text-[11px] text-gray-500 block mb-1">Ventas de Hoy</span>
          <span className="text-xl font-bold text-gray-800">$ 1,268.00</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
          <span className="text-[11px] text-gray-500 block mb-1">Tickets Emitidos</span>
          <span className="text-xl font-bold text-gray-800">14</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
          <span className="text-[11px] text-gray-500 block mb-1">Promedio por Ticket</span>
          <span className="text-xl font-bold text-gray-800">$ 90.57</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-xs text-gray-700">Histórico de ventas</div>
          <input
            type="date"
            defaultValue="2026-02-19"
            className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-600"
          />
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 font-medium">Folio Ticket</th>
              <th className="pb-2 font-medium">Hora</th>
              <th className="pb-2 font-medium text-center">Artículos</th>
              <th className="pb-2 font-medium text-center">Método Pago</th>
              <th className="pb-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {salesHistory.map((s) => (
              <tr key={s.id} className="text-gray-700">
                <td className="py-2.5 font-medium">{s.id}</td>
                <td className="py-2.5 text-gray-500">{s.time}</td>
                <td className="py-2.5 text-center">{s.items}</td>
                <td className="py-2.5 text-center">{s.method}</td>
                <td className="py-2.5 text-right font-semibold">${s.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};