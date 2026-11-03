import React from 'react';

interface Props {
  onOpenAgregarProducto: () => void;
}

export const Inventario: React.FC<Props> = ({ onOpenAgregarProducto }) => {
  const products = [
    { id: 'CUA-100R', name: 'Cuaderno profesional', category: 'Cuadernos', details: 'Raya, 100 hojas', stock: 48, min: 20, price: 45.00, status: 'Disponible' },
    { id: 'LAP-HB02', name: 'Lápiz de grafito HB', category: 'Escritura', details: 'No. 2', stock: 8, min: 15, price: 6.00, status: 'Stock bajo' },
    { id: 'MAR-12C', name: 'Marcadores de colores', category: 'Arte', details: 'Estuche de 12 piezas', stock: 0, min: 8, price: 68.00, status: 'Sin existencias' },
    { id: 'TIJ-13CM', name: 'Tijeras escolares', category: 'Escolar', details: 'Punta redonda', stock: 12, min: 6, price: 25.00, status: 'Disponible' },
  ];

  return (
    <div className="p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inventario</h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">Consulta existencias y administra tus productos.</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-sky-300 text-sky-800 text-xs px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 font-semibold transition shadow-xs cursor-pointer">
            Ajustar existencias
          </button>
          <button
            onClick={onOpenAgregarProducto}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs px-4 py-2.5 rounded-xl font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Agregar producto</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Productos en catálogo</span>
          <span className="text-2xl font-extrabold text-slate-900">8</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">Modelos distintos registrados</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Unidades disponibles</span>
          <span className="text-2xl font-extrabold text-slate-900">293</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">Existencias totales en inventario</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Productos por reponer</span>
          <span className="text-2xl font-extrabold text-amber-600">3</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">2 con stock bajo · 1 sin existencias</span>
        </div>
      </div>

      {/* Contenedor Principal / Tabla */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900">Productos</h3>
          <span className="text-[11px] text-sky-700 font-semibold">Precios en MXN</span>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar producto</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sky-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Nombre o modelo"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Categoría</label>
            <select className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white">
              <option>Todas las categorías</option>
              <option>Cuadernos</option>
              <option>Escritura</option>
              <option>Arte</option>
              <option>Escolar</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estado de stock</label>
            <select className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white">
              <option>Todos los estados</option>
              <option>Disponible</option>
              <option>Stock bajo</option>
              <option>Sin existencias</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full text-left text-xs border-collapse">
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
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-block ${
                      p.status === 'Sin existencias'
                        ? 'bg-slate-900 text-white'
                        : p.status === 'Stock bajo'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="pt-4 border-t border-sky-100 flex justify-between items-center text-xs text-slate-500">
          <span>Mostrando 8 de 8 productos</span>
          <div className="flex items-center gap-2">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&lt;</button>
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};