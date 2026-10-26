import React from "react";

interface Pedido {
  id: string;
  cliente: string;
  contacto: string;
  fechaPedido: string;
  fechaEntrega: string;
  estado: string;
  articulosResumen: string;
  articulosCount: number;
  total: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}

export const PedidoDetalleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pedido,
}) => {
  if (!isOpen || !pedido) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle del pedido ${pedido.id}`}
        className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto border border-sky-100"
      >
        {/* Cabecera del Modal con fondo celeste suave */}
        <div className="bg-sky-50/80 border-b border-sky-100 px-4 sm:px-6 py-4 flex justify-between items-center">
          <span className="font-extrabold text-sm text-sky-800">Papelink</span>
          <button
            onClick={onClose}
            aria-label="Cerrar detalle del pedido"
            className="w-8 h-8 bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center text-xs transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Título y Estado */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Pedido : {pedido.id}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Del usuario{" "}
                <span className="font-semibold text-slate-800">
                  {pedido.cliente}
                </span>{" "}
                con contacto (~{pedido.contacto})
              </p>
            </div>
            <span className="self-start text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              Estado : {pedido.estado}
            </span>
          </div>

          {/* Fechas en bloque celeste tenue */}
          <div className="space-y-1 text-xs text-slate-600 bg-sky-50/50 p-3.5 rounded-xl border border-sky-100/70">
            <p>
              Pedido hecho el día{" "}
              <span className="font-semibold text-slate-900">
                {pedido.fechaPedido}
              </span>
            </p>
            <p>
              Fecha de entrega{" "}
              <span className="font-semibold text-slate-900">
                {pedido.fechaEntrega}
              </span>
            </p>
          </div>

          {/* Lista de productos solicitados */}
          <div className="bg-gradient-to-br from-sky-50/60 to-white border border-sky-200/80 rounded-xl p-4 space-y-2 shadow-2xs">
            <span className="text-[10px] font-extrabold tracking-widest text-sky-700 uppercase block">
              LISTA DE PRODUCTOS SOLICITADOS
            </span>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 pt-1">
              <div>
                <p className="font-bold text-sm text-slate-900">
                  {pedido.articulosResumen}
                </p>
                <p className="text-xs text-sky-600 font-semibold">
                  {pedido.articulosCount} artículos
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-slate-500 mr-1.5 font-medium">
                  Total:
                </span>
                <span className="text-xl font-extrabold text-sky-700">
                  ${pedido.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 border border-sky-200 rounded-xl text-xs font-semibold text-sky-800 bg-white hover:bg-sky-50 transition text-center cursor-pointer"
            >
              — Cancelar Pedido
            </button>
            <button
              onClick={() => {
                alert(`Pedido ${pedido.id} marcado como completado.`);
                onClose();
              }}
              className="py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition text-center shadow-xs cursor-pointer"
            >
              + Registrar como completado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};