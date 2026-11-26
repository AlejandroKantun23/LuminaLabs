import React, { useEffect, useRef, useState } from "react";
import type { Metodo } from "../../api/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  totalItems: number;
  onConfirmSale: (metodo: Metodo) => Promise<boolean>;
  error?: string;
  isSubmitting?: boolean;
}

const METODOS: Array<{ id: Metodo; label: string }> = [
  { id: "efectivo", label: "Efectivo" },
  { id: "tarjeta", label: "Tarjeta" },
  { id: "transferencia", label: "Transferencia" },
];

export const EstadoNegocioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  totalAmount,
  totalItems,
  onConfirmSale,
  error = "",
  isSubmitting = false,
}) => {
  const [metodo, setMetodo] = useState<Metodo>("efectivo");
  const [payment, setPayment] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMetodo("efectivo");
    setPayment("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isCash = metodo === "efectivo";
  const numericPayment = parseFloat(payment) || 0;
  const isPaymentInsufficient = isCash && numericPayment < totalAmount;
  const change = isCash ? Math.max(0, numericPayment - totalAmount) : 0;

  const handleConfirm = async () => {
    if (isSubmitting || isPaymentInsufficient) return;
    if (await onConfirmSale(metodo)) {
      setPayment("");
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cobrar venta"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[470px] max-h-[90vh] overflow-y-auto p-5 sm:p-6 border border-sky-100"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <span className="font-extrabold text-sky-800 text-xs uppercase tracking-wider">
            Cobrar Venta
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Total y Artículos */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-slate-900 rounded-xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase block mb-1">
              Total a cobrar
            </span>
            <span className="text-3xl font-black font-mono text-emerald-400">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="w-28 bg-sky-50 border border-sky-100 rounded-xl p-4 text-center flex flex-col justify-center">
            <span className="text-[10px] text-sky-700 font-bold leading-tight mb-1">
              Artículos
            </span>
            <span className="text-2xl font-extrabold text-sky-800">
              {totalItems}
            </span>
          </div>
        </div>

        {/* Pago con efectivo y cambio */}
        {isCash ? (
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label htmlFor="pago-con" className="text-slate-700 font-bold">
                Pago Con $
              </label>
              <input
                ref={inputRef}
                id="pago-con"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleConfirm();
                  }
                }}
                className={`w-36 text-right border-2 rounded-lg px-3 py-2 text-base font-extrabold text-slate-900 placeholder-slate-300 focus:outline-none ${
                  payment !== "" && isPaymentInsufficient
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-sky-300 focus:border-sky-600"
                }`}
              />
            </div>

            {payment !== "" && isPaymentInsufficient && (
              <p className="text-[11px] text-rose-600 font-semibold text-right">
                Faltan ${(totalAmount - numericPayment).toFixed(2)} para cubrir el total.
              </p>
            )}

            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3 font-bold">
              <span className="text-slate-600">Su Cambio</span>
              <span className="font-extrabold text-emerald-700 text-lg font-mono">
                ${change.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-5 p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-900">
            Se registrará el cobro exacto de{" "}
            <strong>${totalAmount.toFixed(2)} MXN</strong> mediante{" "}
            <strong>{metodo}</strong>.
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setPayment("");
              onClose();
            }}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancelar (ESC)
          </button>
          <button
            type="button"
            disabled={isSubmitting || isPaymentInsufficient}
            onClick={() => void handleConfirm()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl shadow-sm transition cursor-pointer"
          >
            {isSubmitting ? "Guardando..." : "Cobrar e Imprimir Ticket"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-xs font-semibold text-rose-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};