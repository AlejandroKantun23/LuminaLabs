import React, { useState } from 'react';
import { VentaDetalleModal } from '../components/modals/detalleventa';

interface Props {
  salesList: any[];
}

export const Ventas: React.FC<Props> = ({ salesList }) => {
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPeriodo = salesList.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Ventas</h1>
        <p className="text-xs text-sky-700 font-semibold mt-0.5">Consulta y registra las ventas de tu papelería.</p>
      </div>

      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Registro de ventas</h3>

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
            {salesList.map((s) => (
              <tr key={s.id} className="text-slate-800 hover:bg-sky-50/50">
                <td className="py-3.5 font-bold text-sky-700">{s.id}</td>
                <td className="py-3.5 text-slate-500">{s.date} - {s.time}</td>
                <td className="py-3.5 font-bold">{s.itemsSummary}</td>
                <td className="py-3.5 font-bold">${s.total.toFixed(2)}</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800">{s.status}</span>
                </td>
                <td className="py-3.5 text-right">
                  <button 
                    onClick={() => { setSelectedSale(s); setIsModalOpen(true); }} 
                    className="text-sky-700 hover:underline font-semibold cursor-pointer"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="py-3 px-4 bg-gradient-to-r from-sky-100/70 to-sky-50/80 rounded-xl flex justify-between items-center text-xs font-extrabold text-sky-900 border border-sky-200/80">
          <span>Total del período · {salesList.length} ventas</span>
          <span>${totalPeriodo.toFixed(2)} MXN</span>
        </div>
      </div>

      <VentaDetalleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        sale={selectedSale} 
      />
    </div>
  );
};