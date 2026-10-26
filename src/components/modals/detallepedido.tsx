import React from 'react';

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

export const PedidoDetalleModal: React.FC<Props> = ({ isOpen, onClose, pedido }) => {
  if (!isOpen || !pedido) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] overflow-hidden border border-gray-200">
        
        {/* Cabecera del Modal */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <span className="font-bold text-sm text-gray-900">Papelink</span>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-gray-800 hover:bg-black text-white rounded-md flex items-center justify-center text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 space-y-6">
          {/* Título y Estado */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Pedido : {pedido.id}</h2>
              <p className="text-xs text-gray-500 mt-1">
                Del usuario {pedido.cliente} con contacto (~{pedido.contacto})
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              Estado : {pedido.estado}
            </span>
          </div>

          {/* Fechas */}
          <div className="space-y-1 text-xs text-gray-600">
            <p>Pedido hecho el día {pedido.fechaPedido}</p>
            <p>Fecha de entrega {pedido.fechaEntrega}</p>
          </div>

          {/* Lista de productos solicitados */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block">
              LISTA DE PRODUCTOS SOLICITADOS
            </span>
            <div className="flex justify-between items-end pt-1">
              <div>
                <p className="font-bold text-sm text-gray-900">{pedido.articulosResumen}</p>
                <p className="text-xs text-gray-500">{pedido.articulosCount} artículos</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 mr-1">Total:</span>
                <span className="text-lg font-extrabold text-gray-900">${pedido.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition text-center"
            >
              — Cancelar Pedido
            </button>
            <button
              onClick={() => {
                alert(`Pedido ${pedido.id} marcado como completado.`);
                onClose();
              }}
              className="py-2.5 px-4 bg-[#2F3430] hover:bg-black text-white rounded-xl text-xs font-semibold transition text-center shadow-sm"
            >
              + Registrar como completado
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};