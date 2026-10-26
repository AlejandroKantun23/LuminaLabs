import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EstadoInventarioModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Registrar producto"
        className="bg-white rounded-lg shadow-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative border border-gray-200"
      >
        <div className="text-center font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider border-b pb-2">
          Estado del inventario - Registrar Producto
        </div>

        <form
          className="space-y-3 text-xs"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <div>
            <label htmlFor="inv-codigo" className="block text-gray-600 mb-1">
              Código de Barras / ID
            </label>
            <input
              id="inv-codigo"
              type="text"
              placeholder="Ej: 750123456789"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label htmlFor="inv-nombre" className="block text-gray-600 mb-1">
              Nombre del Producto
            </label>
            <input
              id="inv-nombre"
              type="text"
              placeholder="Ej: Cuaderno Profesional 100 hojas"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="inv-precio" className="block text-gray-600 mb-1">
                Precio de Venta ($)
              </label>
              <input
                id="inv-precio"
                type="number"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label htmlFor="inv-cat" className="block text-gray-600 mb-1">
                Categoría
              </label>
              <select
                id="inv-cat"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option>Cuadernos</option>
                <option>Escritura</option>
                <option>Papel</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="inv-stock" className="block text-gray-600 mb-1">
                Stock Inicial
              </label>
              <input
                id="inv-stock"
                type="number"
                placeholder="10"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label htmlFor="inv-min" className="block text-gray-600 mb-1">
                Stock Mínimo (Alerta)
              </label>
              <input
                id="inv-min"
                type="number"
                placeholder="5"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Guardar en Inventario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};