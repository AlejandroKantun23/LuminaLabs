import React, { useState } from "react";

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
  const [payment, setPayment] = useState<number>(0);

  if (!isOpen) return null;

  const change = Math.max(0, payment - totalAmount);

  return (
    <div className="fixed inset-0 bg-blue-950/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Estado del negocio"
        className="bg-white rounded-2xl shadow-xl w-full max-w-[450px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative border border-blue-100"
      >
        <div className="text-center font-bold text-blue-900 mb-2 text-xs uppercase tracking-wider">
          Estado del Negocio
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="flex-1 bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-center">
            <span className="text-xs text-blue-600 font-medium block mb-1">
              Total a cobrar
            </span>
            <span className="text-3xl font-extrabold text-blue-700">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="w-full sm:w-28 bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-center flex flex-col justify-center">
            <span className="text-[10px] text-blue-600 font-medium leading-tight mb-1">
              Total de Artículos
            </span>
            <span className="text-2xl font-bold text-blue-700">
              {totalItems}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-xs font-semibold">
            <label htmlFor="pago-con" className="text-gray-600">
              Pago Con $
            </label>
            <input
              id="pago-con"
              type="number"
              value={payment}
              onChange={(e) => setPayment(Number(e.target.value))}
              className="w-28 text-right border border-blue-200 rounded-lg px-2 py-1.5 font-bold text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between items-center text-xs border-t border-blue-50 pt-3 font-semibold">
            <span className="text-gray-600">Su Cambio $</span>
            <span className="font-bold text-blue-600 text-sm">
              ${change.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirmSale();
              onClose();
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
          >
            Cobrar e Imprimir Ticket
          </button>
        </div>
      </div>
    </div>
  );
};