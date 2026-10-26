import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EstadoInventarioModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[500px] p-6 relative border border-gray-200">
        <div className="text-center font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider border-b pb-2">
          Estado del inventario - Registrar Producto
        </div>

        <form className="space-y-3 text-xs" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div>
            <label className="block text-gray-600 mb-1">Código de Barras / ID</label>
            <input type="text" placeholder="Ej: 750123456789" className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Nombre del Producto</label>
            <input type="text" placeholder="Ej: Cuaderno Profesional 100 hojas" className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-1">Precio de Venta ($)</label>
              <input type="number" placeholder="0.00" className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Categoría</label>
              <select className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400">
                <option>Cuadernos</option>
                <option>Escritura</option>
                <option>Papel</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-1">Stock Inicial</label>
              <input type="number" placeholder="10" className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Stock Mínimo (Alerta)</label>
              <input type="number" placeholder="5" className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-1.5 bg-gray-800 text-white rounded hover:bg-gray-900">
              Guardar en Inventario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};