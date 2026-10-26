import React from "react";

interface Props {
  onOpenAgregarProducto: () => void;
}

const statusClass = (status: string) =>
  status === "Sin existencias"
    ? "bg-slate-900 text-white"
    : status === "Stock bajo"
      ? "bg-amber-100 text-amber-800 border border-amber-200"
      : "bg-sky-100 text-sky-800";

export const Inventario: React.FC<Props> = ({ onOpenAgregarProducto }) => {
  const products = [
    {
      id: "CUA-100R",
      name: "Cuaderno profesional",
      category: "Cuadernos",
      details: "Raya, 100 hojas",
      stock: 48,
      min: 20,
      price: 45.0,
      status: "Disponible",
    },
    {
      id: "LAP-HB02",
      name: "Lápiz de grafito HB",
      category: "Escritura",
      details: "No. 2",
      stock: 8,
      min: 15,
      price: 6.0,
      status: "Stock bajo",
    },
    {
      id: "MAR-12C",
      name: "Marcadores de colores",
      category: "Arte",
      details: "Estuche de 12 piezas",
      stock: 0,
      min: 8,
      price: 68.0,
      status: "Sin existencias",
    },
    {
      id: "TIJ-13CM",
      name: "Tijeras escolares",
      category: "Escolar",
      details: "Punta redonda",
      stock: 12,
      min: 6,
      price: 25.0,
      status: "Disponible",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Inventario
          </h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">
            Consulta existencias y administra tus productos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="border border-sky-300 text-sky-800 text-xs px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 font-semibold transition shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
            Ajustar existencias
          </button>
          <button
            onClick={onOpenAgregarProducto}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs px-4 py-2.5 rounded-xl font-semibold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <span>+ Agregar producto</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Productos en catálogo
          </span>
          <span className="text-2xl font-extrabold text-slate-900">8</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            Modelos distintos registrados
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Unidades disponibles
          </span>
          <span className="text-2xl font-extrabold text-slate-900">293</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            Existencias totales en inventario
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Productos por reponer
          </span>
          <span className="text-2xl font-extrabold text-amber-600">3</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            2 con stock bajo · 1 sin existencias
          </span>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center gap-3">
          <h2 className="font-bold text-sm text-slate-900">Productos</h2>
          <span className="text-[11px] text-sky-700 font-semibold">
            Precios en MXN
          </span>
        </div>

        {/* Filtros: 1 columna en celular, 2 en tableta, 3 en laptop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="inv-buscar"
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
                id="inv-buscar"
                type="text"
                placeholder="Nombre o modelo"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="inv-categoria"
              className="block text-[11px] font-semibold text-slate-700 mb-1"
            >
              Categoría
            </label>
            <select
              id="inv-categoria"
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <option>Todas las categorías</option>
              <option>Cuadernos</option>
              <option>Escritura</option>
              <option>Arte</option>
              <option>Escolar</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="inv-estado"
              className="block text-[11px] font-semibold text-slate-700 mb-1"
            >
              Estado de stock
            </label>
            <select
              id="inv-estado"
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <option>Todos los estados</option>
              <option>Disponible</option>
              <option>Stock bajo</option>
              <option>Sin existencias</option>
            </select>
          </div>
        </div>

        {/* ===== CELULAR / TABLETA / LAPTOP CHICA: tarjetas (hasta 1280 px) ===== */}
        <ul className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="border border-sky-100 rounded-xl p-4 bg-sky-50/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {p.category} · {p.details}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-block shrink-0 ${statusClass(p.status)}`}
                >
                  {p.status}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-[10px] font-semibold text-sky-800">
                    Modelo
                  </dt>
                  <dd className="font-mono text-[11px] text-sky-700 font-semibold">
                    {p.id}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold text-sky-800">
                    Precio (MXN)
                  </dt>
                  <dd className="font-semibold text-slate-900">
                    ${p.price.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold text-sky-800">
                    Existencias
                  </dt>
                  <dd className="font-bold text-slate-900">{p.stock}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold text-sky-800">
                    Mínimo
                  </dt>
                  <dd className="text-slate-600">{p.min}</dd>
                </div>
              </dl>

              <button
                aria-label={`Editar ${p.name}`}
                className="mt-4 w-full border border-sky-200 rounded-lg py-2.5 text-xs text-sky-700 font-semibold hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Editar
              </button>
            </li>
          ))}
        </ul>

        {/* ===== LAPTOP GRANDE: tabla (desde 1280 px) ===== */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                <th scope="col" className="pb-3 pr-3">Producto</th>
                <th scope="col" className="pb-3 pr-3">Modelo</th>
                <th scope="col" className="pb-3 pr-3 text-center">Existencias</th>
                <th scope="col" className="pb-3 pr-3 text-center">Mínimo</th>
                <th scope="col" className="pb-3 pr-3">Precio (MXN)</th>
                <th scope="col" className="pb-3 pr-3">Estado</th>
                <th scope="col" className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="text-slate-800 hover:bg-sky-50/50 transition"
                >
                  <td className="py-3.5 pr-3">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {p.category} · {p.details}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-[11px] text-sky-700 font-semibold">
                    {p.id}
                  </td>
                  <td className="py-3.5 pr-3 text-center font-bold text-slate-900">
                    {p.stock}
                  </td>
                  <td className="py-3.5 pr-3 text-center text-slate-500">
                    {p.min}
                  </td>
                  <td className="py-3.5 pr-3 font-semibold">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-block ${statusClass(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      aria-label={`Editar ${p.name}`}
                      className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-slate-500">
          <span>Mostrando 8 de 8 productos</span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button
                aria-label="Página anterior"
                className="border border-sky-200 rounded-lg px-3 py-1.5 text-sky-700 hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                &lt;
              </button>
              <button
                aria-label="Página siguiente"
                className="border border-sky-200 rounded-lg px-3 py-1.5 text-sky-700 hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};