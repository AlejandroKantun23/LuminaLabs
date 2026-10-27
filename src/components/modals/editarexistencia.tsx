import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  details: string;
  stock: number;
  min: number;
  price: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedStock: number) => void;
}

export const EditarExistenciasModal: React.FC<Props> = ({ isOpen, onClose, product, onSave }) => {
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setStock(product.stock);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(stock);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[440px] overflow-hidden border border-sky-100">
        
        {/* Cabecera del Modal */}
        <div className="bg-sky-50/80 border-b border-sky-100 px-6 py-4 flex justify-between items-center">
          <span className="font-extrabold text-sm text-sky-800">Papelink · Editar Existencias</span>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center text-xs transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{product.name}</h2>
            <p className="text-xs text-sky-700 font-semibold mt-0.5">
              Modelo: <span className="font-mono">{product.id}</span> · {product.category} ({product.details})
            </p>
          </div>

          <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Stock mínimo requerido:</span>
              <span className="font-bold text-slate-900">{product.min} unidades</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Precio unitario:</span>
              <span className="font-bold text-sky-700">${product.price.toFixed(2)} MXN</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Existencias actuales
            </label>
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-sky-500 focus:bg-white transition"
            />
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-sky-200 rounded-xl text-xs font-semibold text-sky-800 bg-white hover:bg-sky-50 transition text-center cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition text-center shadow-xs cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};