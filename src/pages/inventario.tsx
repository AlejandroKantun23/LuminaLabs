import React from 'react';

interface Props {
  onOpenAgregarProducto: () => void;
}

export const Inventario: React.FC<Props> = ({ onOpenAgregarProducto }) => {
  const products = [
    { id: '7501001', name: 'Cuaderno Profesional Raya', stock: 24, min: 5, price: 35.0, status: 'Normal' },
    { id: '7501002', name: 'Lápiz adhesivo 21g', stock: 2, min: 5, price: 18.0, status: 'Stock Bajo' },
    { id: '7501003', name: 'Pluma Punto Fino Azul', stock: 0, min: 10, price: 8.5, status: 'Agotado' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Inventario</h1>
        <div className="flex gap-2">
          <button className="border border-gray-300 text-gray-700 text-xs px-3 py-1.5 rounded bg-white hover:bg-gray-50">
            Ajustar existencia
          </button>
          <button
            onClick={onOpenAgregarProducto}
            className="bg-gray-800 hover:bg-black text-white text-xs px-4 py-1.5 rounded font-medium"
          >
            + Agregar producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
          <span className="text-[11px] text-gray-500 block mb-1">Total de Productos</span>
          <span className="text-xl font-bold text-gray-800">265</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
          <span className="text-[11px] text-gray-500 block mb-1">Productos con Alerta</span>
          <span className="text-xl font-bold text-gray-800">3</span>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
          <span className="text-[11px] text-gray-500 block mb-1">Valor de Inventario</span>
          <span className="text-xl font-bold text-gray-800">$ 12,450.00</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Buscar por código o producto..."
            className="w-72 border border-gray-300 rounded px-3 py-1 text-xs focus:outline-none"
          />
          <select className="border border-gray-300 rounded px-3 py-1 text-xs text-gray-600">
            <option>Todas las categorías</option>
          </select>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 font-medium">Código</th>
              <th className="pb-2 font-medium">Nombre</th>
              <th className="pb-2 font-medium text-center">Stock</th>
              <th className="pb-2 font-medium text-center">Mínimo</th>
              <th className="pb-2 font-medium text-right">Precio</th>
              <th className="pb-2 font-medium text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="text-gray-700">
                <td className="py-2.5 font-mono text-[11px]">{p.id}</td>
                <td className="py-2.5 font-medium">{p.name}</td>
                <td className="py-2.5 text-center">{p.stock}</td>
                <td className="py-2.5 text-center">{p.min}</td>
                <td className="py-2.5 text-right">${p.price.toFixed(2)}</td>
                <td className="py-2.5 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      p.status === 'Agotado'
                        ? 'bg-red-100 text-red-700'
                        : p.status === 'Stock Bajo'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};