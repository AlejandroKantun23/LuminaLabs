import React from 'react';

interface Sale {
  id: string;
  date: string;
  time: string;
  itemsSummary: string;
  itemCount: number;
  total: number;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export const VentaDetalleModal: React.FC<Props> = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] overflow-hidden border border-sky-100">
        
        {/* Cabecera del Modal */}
        <div className="bg-sky-50/80 border-b border-sky-100 px-6 py-4 flex justify-between items-center">
          <span className="font-extrabold text-sm text-sky-800">Papelink · Detalle de Venta</span>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center text-xs transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 space-y-6">
          {/* Identificador y Estado */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Venta : {sale.id}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Registrada el día <span className="font-semibold text-slate-800">{sale.date}</span> a las <span className="font-semibold text-slate-800">{sale.time}</span>
              </p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              Estado : {sale.status}
            </span>
          </div>

          {/* Bloque de Artículos Vendidos */}
          <div className="bg-gradient-to-br from-sky-50/60 to-white border border-sky-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
            <span className="text-[10px] font-extrabold tracking-widest text-sky-700 uppercase block">
              RESUMEN DE ARTÍCULOS
            </span>
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-900 text-sm">{sale.itemsSummary}</p>
                <p className="text-xs text-sky-600 font-semibold mt-0.5">{sale.itemCount} artículos en total</p>
              </div>
            </div>
            <div className="border-t border-sky-200/70 pt-3 flex justify-between items-end">
              <span className="text-xs text-slate-500 font-medium">Total de la venta:</span>
              <span className="text-xl font-extrabold text-sky-700">${sale.total.toFixed(2)} MXN</span>
            </div>
          </div>

          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-[450px] max-h-[90vh] overflow-y-auto p-5 sm:p-6 border border-sky-100">
    
    {/* Distribución interna adaptable */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
      <div className="flex-1 bg-sky-50/60 border border-sky-100 rounded-xl p-4 text-center">
        {/* Total a cobrar */}
      </div>
      <div className="w-full sm:w-28 bg-sky-50/60 border border-sky-100 rounded-xl p-4 text-center">
        {/* Total artículos */}
      </div>
    </div>

    {/* Botones de acción inferiores */}
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
      <button className="px-4 py-2.5 border border-sky-200 text-sky-800 text-xs font-semibold rounded-xl hover:bg-sky-50">Cancelar</button>
      <button className="px-4 py-2.5 bg-sky-600 text-white text-xs font-semibold rounded-xl shadow-xs">Cobrar e Imprimir Ticket</button>
    </div>

  </div>
</div>

          {/* Botón de Cerrar */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition text-center shadow-xs cursor-pointer"
            >
              Cerrar detalle
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};