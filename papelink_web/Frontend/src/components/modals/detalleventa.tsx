import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sale: any | null;
}

export const DetalleVentaModal: React.FC<Props> = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] border border-sky-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-sky-100 pb-3">
          <h2 className="font-extrabold text-slate-900 text-base">Detalle de Venta #{sale.id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
        <div className="space-y-2 text-xs">
          <p><span className="font-semibold text-slate-600">Fecha:</span> {sale.date} ({sale.time})</p>
          <p><span className="font-semibold text-slate-600">Resumen:</span> {sale.itemsSummary}</p>
          <p><span className="font-semibold text-slate-600">Artículos:</span> {sale.itemCount}</p>
          <p className="text-sm font-bold text-sky-700"><span className="font-semibold text-slate-600">Total:</span> ${sale.total.toFixed(2)} MXN</p>
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">Cerrar</button>
        </div>
      </div>
    </div>
  );
};