import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  totalItems: number;
  onConfirmSale: () => void;
}

export const EstadoNegocioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  totalAmount,
  totalItems,
  onConfirmSale,
}) => {
  const [payment, setPayment] = useState<number>(200);

  if (!isOpen) return null;

  const change = Math.max(0, payment - totalAmount);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[450px] p-6 relative border border-gray-200">
        <div className="text-center font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider">
          Estado del Negocio
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
            <span className="text-xs text-gray-500 font-medium block mb-1">Total a cobrar</span>
            <span className="text-3xl font-extrabold text-gray-900">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="w-28 bg-gray-50 border border-gray-200 rounded-md p-4 text-center flex flex-col justify-center">
            <span className="text-[10px] text-gray-500 font-medium leading-tight mb-1">Total de Artículos</span>
            <span className="text-2xl font-bold text-gray-800">{totalItems}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Pago Con $</span>
            <input
              type="number"
              value={payment}
              onChange={(e) => setPayment(Number(e.target.value))}
              className="w-28 text-right border border-gray-300 rounded px-2 py-1 font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
            <span className="text-gray-600">Su Cambio $</span>
            <span className="font-bold text-gray-900">${change.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirmSale();
              onClose();
            }}
            className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded hover:bg-black"
          >
            Cobrar e Imprimir Ticket
          </button>
        </div>
      </div>
    </div>
  );
};