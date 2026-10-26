import React, { useState } from 'react';

interface Props {
  onOpenCobro: () => void;
}

interface CartItem {
  id: string;
  name: string;
  category: string;
  details: string;
  model: string;
  qty: number;
  price: number;
}

export const InicioPOS: React.FC<Props> = ({ onOpenCobro }) => {
  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'Cuaderno profesional', category: 'Cuadernos', details: 'Raya, 100 hojas', model: 'CUA-100R', qty: 4, price: 45.00 },
    { id: '2', name: 'Lápiz de grafito HB', category: 'Escritura', details: 'No. 2', model: 'LAP-HB02', qty: 3, price: 6.00 },
    { id: '3', name: 'Marcadores de colores', category: 'Arte', details: 'Estuche de 12 piezas', model: 'MAR-12C', qty: 1, price: 68.00 },
    { id: '4', name: 'Tijeras escolares', category: 'Escolar', details: 'Punta redonda', model: 'TIJ-13CM', qty: 2, price: 25.00 },
  ]);

  const handleRemove = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inicio</h1>
          <p className="text-xs text-gray-400 mt-0.5">15/10/2026</p>
        </div>
        <button
          onClick={onOpenCobro}
          className="bg-[#2F3430] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
        >
          <span>+ Registrar venta</span>
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">Ventas de hoy</span>
          <span className="text-2xl font-bold text-gray-900">$8,860.00</span>
          <span className="text-[10px] text-gray-400 block mt-1">MXN · 12 ventas registradas</span>
        </div>
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">Artículos en inventario</span>
          <span className="text-2xl font-bold text-gray-900">148</span>
          <span className="text-[10px] text-gray-400 block mt-1">Productos distintos</span>
        </div>
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">Existencias bajas</span>
          <span className="text-2xl font-bold text-gray-900">3</span>
          <span className="text-[10px] text-gray-400 block mt-1">Artículos por reponer</span>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-12 gap-6">
        {/* Tabla de Productos / Carrito */}
        <div className="col-span-8 bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-gray-900">Productos</h3>
          </div>

          {/* Buscador de Producto y Campo de Cantidad */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Buscar producto</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Nombre o modelo"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <div className="col-span-4">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Cantidad</label>
              <input
                type="text"
                placeholder="Cantidad"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Tabla de Productos */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-[11px]">
                <th className="pb-3 font-medium">Producto</th>
                <th className="pb-3 font-medium">Modelo</th>
                <th className="pb-3 font-medium text-center">Cantidad</th>
                <th className="pb-3 font-medium">Precio (MXN)</th>
                <th className="pb-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cart.map((item) => (
                <tr key={item.id} className="text-gray-800">
                  <td className="py-3.5 pr-2">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-[10px] text-gray-400">{item.category} · {item.details}</div>
                  </td>
                  <td className="py-3.5 font-mono text-[11px] text-gray-600">{item.model}</td>
                  <td className="py-3.5 text-center font-bold text-gray-900">{item.qty}</td>
                  <td className="py-3.5 font-semibold">${item.price.toFixed(2)}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xs text-gray-900 hover:underline font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel Lateral: Últimas ventas */}
        <div className="col-span-4 bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Últimas ventas</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">15 oct. · Datos simulados</p>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-xs text-gray-900">Venta #1048</div>
                  <div className="text-[10px] text-gray-400">14:32 · 5 artículos</div>
                </div>
                <div className="font-bold text-xs text-gray-900">$285.00</div>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-xs text-gray-900">Venta #1047</div>
                  <div className="text-[10px] text-gray-400">14:18 · 3 artículos</div>
                </div>
                <div className="font-bold text-xs text-gray-900">$156.00</div>
              </div>

              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-xs text-gray-900">Venta #1046</div>
                  <div className="text-[10px] text-gray-400">13:56 · 8 artículos</div>
                </div>
                <div className="font-bold text-xs text-gray-900">$420.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};