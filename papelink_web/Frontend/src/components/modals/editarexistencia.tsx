import React, { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onSave: (stock: number) => Promise<boolean>;
}

type AdjustMode = "add" | "sub" | "set";

export const EditarExistenciaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [mode, setMode] = useState<AdjustMode>("add");
  const [amount, setAmount] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const currentStock = Number(product?.stock ?? 0);

  useEffect(() => {
    if (!isOpen || !product) return;
    setMode("add");
    setAmount("");
    setError("");
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const numericAmount = Math.max(0, parseInt(amount, 10) || 0);
  const nextStock =
    mode === "add"
      ? currentStock + numericAmount
      : mode === "sub"
      ? Math.max(0, currentStock - numericAmount)
      : numericAmount;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-[440px] border border-sky-100 p-6 space-y-4"
      >
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 block">
              Ajuste de Inventario
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              {product.nombre ?? product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "add" as const, label: "+ Sumar" },
            { id: "sub" as const, label: "− Restar" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMode(opt.id)}
              className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                mode === opt.id
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-sky-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {mode === "add"
              ? "Unidades que ingresan"
              : mode === "sub"
              ? "Unidades a descontar"
              : "Nueva existencia exacta"}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            autoFocus
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-sky-50/40 border border-sky-300 rounded-xl px-3 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-sky-600"
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
          <span className="text-slate-600">
            Actual: <strong className="text-slate-900">{currentStock}</strong>
          </span>
          <span className="text-slate-400">→</span>
          <span className="text-sky-800 font-bold">
            Quedará en: <strong className="text-base">{nextStock}</strong>
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isSaving || amount === ""}
            onClick={async () => {
              setIsSaving(true);
              setError("");
              try {
                if (await onSave(nextStock)) onClose();
              } catch (requestError) {
                setError(
                  requestError instanceof Error
                    ? requestError.message
                    : "No se pudo actualizar el stock.",
                );
              } finally {
                setIsSaving(false);
              }
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            {isSaving ? "Guardando..." : "Aplicar ajuste"}
          </button>
        </div>

        {error && (
          <p role="alert" className="text-xs font-medium text-rose-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};