import React, { useState } from 'react';

interface Props {
  onOpenCobro: (cartItems: any[]) => void;
}

export const InicioPOS: React.FC<Props> = ({ onOpenCobro }) => {
  const [cart, setCart] = useState([
    { id: 'CUA-100R', name: 'Cuaderno profesional', category: 'Cuadernos', details: 'Raya, 100 hojas', price: 45.00, qty: 4 },
    { id: 'LAP-HB02', name: 'Lápiz de grafito HB', category: 'Escritura', details: 'No. 2', price: 6.00, qty: 3 },
    { id: 'MAR-12C', name: 'Marcadores de colores', category: 'Arte', details: 'Estuche de 12 piezas', price: 68.00, qty: 1 },
    { id: 'TIJ-13CM', name: 'Tijeras escolares', category: 'Escolar', details: 'Punta redonda', price: 25.00, qty: 2 },
  ]);

  return (
    <div className="space-y-6">
      {/* Encabezado Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inicio</h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">15/10/2026</p>
        </div>
        <button
          onClick={() => onOpenCobro(cart)}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition text-center cursor-pointer"
        >
          + Registrar venta
        </button>
      </div>

      {/* Estadísticas: 1 columna en móviles, 3 en pantallas medianas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ventas de hoy</span>
          <span className="text-2xl font-extrabold text-slate-900">$8,860.00</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Artículos en inventario</span>
          <span className="text-2xl font-extrabold text-slate-900">148</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Existencias bajas</span>
          <span className="text-2xl font-extrabold text-amber-600">3</span>
        </div>
      </div>

      {/* Grid Principal: 1 columna en móvil/tablet, 12 columnas en escritorio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Productos</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                  <th className="pb-3">Producto</th>
                  <th className="pb-3 text-center">Cantidad</th>
                  <th className="pb-3">Precio</th>
                  <th className="pb-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {cart.map((item) => (
                  <tr key={item.id} className="text-slate-800">
                    <td className="py-3.5 font-bold">{item.name}</td>
                    <td className="py-3.5 text-center font-bold">{item.qty}</td>
                    <td className="py-3.5 font-semibold">${(item.price * item.qty).toFixed(2)}</td>
                    <td className="py-3.5 text-right">
                      <button className="text-xs text-rose-600 hover:underline cursor-pointer">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-gradient-to-b from-white to-sky-50/60 border border-sky-100 rounded-2xl shadow-xs p-6">
          <h3 className="font-bold text-sm text-slate-900 mb-4">Últimas ventas</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-sky-100">
              <span>Venta #1048</span>
              <span className="font-bold text-sky-700">$285.00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-sky-100">
              <span>Venta #1047</span>
              <span className="font-bold text-sky-700">$156.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};