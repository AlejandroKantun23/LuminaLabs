import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  totalItems: number;
  onConfirmSale: () => Promise<boolean>;
  error?: string;
  isSubmitting?: boolean;
}

export const EstadoNegocioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  totalAmount,
  totalItems,
  onConfirmSale,
  error = "",
  isSubmitting = false,
}) => {
  // CAMBIO 1: Iniciar como cadena vacía para que no aparezca el 0
  const [payment, setPayment] = useState<string>("");

  if (!isOpen) return null;

  // CAMBIO 2: Convertir a número únicamente para las validaciones y el cambio
  const numericPayment = parseFloat(payment) || 0;
  const isPaymentInsufficient = numericPayment < totalAmount;
  const change = Math.max(0, numericPayment - totalAmount);

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
            {/* CAMBIO 3: Guardar el valor como string y dejar el campo limpio */}
            <input
              id="pago-con"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className={`w-28 text-right border rounded-lg px-2 py-1.5 font-bold text-gray-800 placeholder-gray-300 focus:outline-none ${
                payment !== "" && isPaymentInsufficient
                  ? "border-red-400 focus:border-red-500"
                  : "border-blue-200 focus:border-blue-500"
              }`}
            />
          </div>

          {payment !== "" && isPaymentInsufficient && (
            <p className="text-[11px] text-red-600 font-medium text-right">
              Faltan ${(totalAmount - numericPayment).toFixed(2)} para cubrir el total.
            </p>
          )}

          <div className="flex justify-between items-center text-xs border-t border-blue-50 pt-3 font-semibold">
            <span className="text-gray-600">Su Cambio $</span>
            <span className="font-bold text-blue-600 text-sm">
              ${change.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            onClick={() => {
              // CAMBIO 4: Limpiar con cadena vacía al cerrar
              setPayment("");
              onClose();
            }}
            className="px-4 py-2.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            disabled={isSubmitting || isPaymentInsufficient}
            onClick={async () => {
              if (isPaymentInsufficient) return;
              if (await onConfirmSale()) {
                // CAMBIO 4: Limpiar con cadena vacía tras confirmar
                setPayment("");
                onClose();
              }
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
          >
            {isSubmitting ? "Procesando..." : "Cobrar e Imprimir Ticket"}
          </button>
        </div>
        {error && <p role="alert" className="mt-3 text-xs font-medium text-red-600">{error}</p>}
      </div>
    </div>
  );
};