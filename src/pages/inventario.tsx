import React, { useState } from 'react';
import { EstadoInventarioModal } from '../components/modals/agregarinventario';
import { EditarExistenciasModal } from '../components/modals/editarexistencia';

interface Props {
  onOpenAgregarProducto: () => void;
}

export const Inventario: React.FC<Props> = () => {
  const [products, setProducts] = useState([
    { id: 'CUA-100R', name: 'Cuaderno profesional', category: 'Cuadernos', details: 'Raya, 100 hojas', stock: 48, min: 20, price: 45.00, status: 'Disponible' },
    { id: 'LAP-HB02', name: 'Lápiz de grafito HB', category: 'Escritura', details: 'No. 2', stock: 8, min: 15, price: 6.00, status: 'Stock bajo' },
    { id: 'MAR-12C', name: 'Marcadores de colores', category: 'Arte', details: 'Estuche de 12 piezas', stock: 0, min: 8, price: 68.00, status: 'Sin existencias' },
    { id: 'TIJ-13CM', name: 'Tijeras escolares', category: 'Escolar', details: 'Punta redonda', stock: 12, min: 6, price: 25.00, status: 'Disponible' },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveStock = (newStock: number) => {
    if (!selectedProduct) return;
    setProducts(products.map(p => {
      if (p.id === selectedProduct.id) {
        let status = 'Disponible';
        if (newStock === 0) status = 'Sin existencias';
        else if (newStock <= p.min) status = 'Stock bajo';
        return { ...p, stock: newStock, status };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inventario</h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">Consulta existencias y administra tus productos.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white text-xs px-4 py-2.5 rounded-xl font-semibold transition shadow-xs cursor-pointer"
        >
          + Agregar producto
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Productos en catálogo</span>
          <span className="text-2xl font-extrabold text-slate-900">{products.length}</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Unidades disponibles</span>
          <span className="text-2xl font-extrabold text-slate-900">{products.reduce((acc, p) => acc + p.stock, 0)}</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Existencias bajas</span>
          <span className="text-2xl font-extrabold text-amber-600">{products.filter(p => p.stock <= p.min).length}</span>
        </div>
      </div>

      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                <th className="pb-3">Producto</th>
                <th className="pb-3">Modelo</th>
                <th className="pb-3 text-center">Existencias</th>
                <th className="pb-3 text-center">Mínimo</th>
                <th className="pb-3">Precio (MXN)</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {products.map((p) => (
                <tr key={p.id} className="text-slate-800 hover:bg-sky-50/50 transition">
                  <td className="py-3.5 pr-2">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.category} · {p.details}</div>
                  </td>
                  <td className="py-3.5 font-mono text-[11px] text-sky-700 font-semibold">{p.id}</td>
                  <td className="py-3.5 text-center font-bold text-slate-900">{p.stock}</td>
                  <td className="py-3.5 text-center text-slate-500">{p.min}</td>
                  <td className="py-3.5 font-semibold">${p.price.toFixed(2)}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${p.stock === 0 ? 'bg-slate-900 text-white' : p.stock <= p.min ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => { setSelectedProduct(p); setIsEditModalOpen(true); }}
                      className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EstadoInventarioModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditarExistenciasModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} product={selectedProduct} onSave={handleSaveStock} />
    </div>
  );
};