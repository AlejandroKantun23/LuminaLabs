import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  onSave: (stock: number) => void;
}

export const EditarExistenciaModal: React.FC<Props> = ({ isOpen, onClose, product, onSave }) => {
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    if (product) setStock(product.stock);
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[440px] overflow-hidden border border-sky-100 p-6 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">Editar Existencias: {product.name}</h2>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad en stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 border border-sky-200 text-xs rounded-xl">Cancelar</button>
          <button onClick={() => { onSave(stock); onClose(); }} className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl">Guardar</button>
        </div>
      </div>
    </div>
  );
};