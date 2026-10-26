import React, { useState } from "react";

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
    {
      id: "1",
      name: "Cuaderno profesional",
      category: "Cuadernos",
      details: "Raya, 100 hojas",
      model: "CUA-100R",
      qty: 4,
      price: 45.0,
    },
    {
      id: "2",
      name: "Lápiz de grafito HB",
      category: "Escritura",
      details: "No. 2",
      model: "LAP-HB02",
      qty: 3,
      price: 6.0,
    },
    {
      id: "3",
      name: "Marcadores de colores",
      category: "Arte",
      details: "Estuche de 12 piezas",
      model: "MAR-12C",
      qty: 1,
      price: 68.0,
    },
    {
      id: "4",
      name: "Tijeras escolares",
      category: "Escolar",
      details: "Punta redonda",
      model: "TIJ-13CM",
      qty: 2,
      price: 25.0,
    },
  ]);

  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Inicio
          </h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">
            15/10/2026
          </p>
        </div>
        <button
          onClick={onOpenCobro}
          className="w-full sm:w-auto justify-center bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <span>+ Registrar venta</span>
        </button>
      </div>

      {/* Tarjetas de Estadísticas: 1 columna en celular, 3 desde tableta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ventas de hoy
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            $8,860.00
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            MXN · 12 ventas registradas
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Artículos en inventario
          </span>
          <span className="text-2xl font-extrabold text-slate-900">148</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            Productos distintos
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Existencias bajas
          </span>
          <span className="text-2xl font-extrabold text-amber-600">3</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            Artículos por reponer
          </span>
        </div>
      </div>

      {/* Grid Principal: apilado hasta 1280 px, dos columnas desde ahí */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6">
        {/* Tabla de Productos / Carrito */}
        <div className="xl:col-span-8 min-w-0 bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-sm text-slate-900">Productos</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
            <div className="sm:col-span-8">
              <label
                htmlFor="buscar-producto"
                className="block text-[11px] font-semibold text-slate-700 mb-1"
              >
                Buscar producto
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sky-500" aria-hidden="true">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  id="buscar-producto"
                  type="text"
                  placeholder="Nombre o modelo"
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300 transition"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="cantidad-producto"
                className="block text-[11px] font-semibold text-slate-700 mb-1"
              >
                Cantidad
              </label>
              <input
                id="cantidad-producto"
                type="text"
                placeholder="Cantidad"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300 transition"
              />
            </div>
          </div>

          {cart.length === 0 && (
            <p
              role="status"
              className="text-xs text-slate-500 text-center py-6 border border-dashed border-sky-200 rounded-xl"
            >
              No hay productos en la venta actual.
            </p>
          )}

          {/* ===== CELULAR: tarjetas (se ocultan desde 768 px) ===== */}
          <ul className="md:hidden space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="border border-sky-100 rounded-xl p-4 bg-sky-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {item.category} · {item.details}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-sky-700 font-semibold shrink-0">
                    {item.model}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-600">
                    Cantidad:{" "}
                    <span className="font-bold text-slate-900">{item.qty}</span>
                  </span>
                  <span className="font-semibold text-slate-900">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Eliminar ${item.name}`}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* ===== TABLET/LAPTOP: tabla (visible desde 768 px) ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                  <th scope="col" className="pb-3 pr-3">Producto</th>
                  <th scope="col" className="pb-3 pr-3">Modelo</th>
                  <th scope="col" className="pb-3 pr-3 text-center">Cantidad</th>
                  <th scope="col" className="pb-3 pr-3">Precio (MXN)</th>
                  <th scope="col" className="pb-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {cart.map((item) => (
                  <tr
                    key={item.id}
                    className="text-slate-800 hover:bg-sky-50/50 transition"
                  >
                    <td className="py-3.5 pr-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.category} · {item.details}
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-[11px] text-sky-700 font-semibold">
                      {item.model}
                    </td>
                    <td className="py-3.5 pr-3 text-center font-bold text-slate-900">
                      {item.qty}
                    </td>
                    <td className="py-3.5 pr-3 font-semibold">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                        className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Lateral: Últimas ventas */}
        <div className="xl:col-span-4 min-w-0 bg-gradient-to-b from-white to-sky-50/60 border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-sm text-slate-900">
                Últimas ventas
              </h2>
              <p className="text-[10px] text-sky-700 font-medium mt-0.5">
                15 oct. · Datos simulados
              </p>
            </div>

            <div className="divide-y divide-sky-100">
              <div className="py-3 flex justify-between items-center gap-3">
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Venta #1048
                  </div>
                  <div className="text-[10px] text-slate-500">
                    14:32 · 5 artículos
                  </div>
                </div>
                <div className="font-bold text-xs text-sky-700">$285.00</div>
              </div>

              <div className="py-3 flex justify-between items-center gap-3">
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Venta #1047
                  </div>
                  <div className="text-[10px] text-slate-500">
                    14:18 · 3 artículos
                  </div>
                </div>
                <div className="font-bold text-xs text-sky-700">$156.00</div>
              </div>

              <div className="py-3 flex justify-between items-center gap-3">
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Venta #1046
                  </div>
                  <div className="text-[10px] text-slate-500">
                    13:56 · 8 artículos
                  </div>
                </div>
                <div className="font-bold text-xs text-sky-700">$420.00</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-sky-100">
            <button
              onClick={() => alert("Navegando a ventas del día...")}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded"
            >
              <span>Ver ventas del día</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};