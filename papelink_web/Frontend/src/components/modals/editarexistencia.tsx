import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onSave: (stock: number) => Promise<boolean>;
}

export const EditarExistenciaModal: React.FC<Props> = ({ isOpen, onClose, product, onSave }) => {
  const [stock, setStock] = useState<number>(product?.stock ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[440px] overflow-hidden border border-sky-100 p-6 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Editar Existencias: {product.name}</h2>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad en stock</label>
          <input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 border border-sky-200 text-xs rounded-xl">Cancelar</button>
          <button
            disabled={isSaving}
            onClick={async () => {
              setIsSaving(true);
              setError("");
              try {
                if (await onSave(stock)) onClose();
              } catch (requestError) {
                setError(requestError instanceof Error ? requestError.message : "No se pudo actualizar el stock.");
              } finally {
                setIsSaving(false);
              }
            }}
            className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
};