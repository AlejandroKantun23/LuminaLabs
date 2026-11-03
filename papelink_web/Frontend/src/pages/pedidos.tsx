import React, { useState } from "react";
import { PedidoDetalleModal } from "../components/modals/detallepedido";

export const Pedidos: React.FC = () => {
  const [selectedPedido, setSelectedPedido] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pedidosList = [
    {
      id: "P-00125",
      cliente: "carlos",
      contacto: "9983164415",
      fechaPedido: "14/10/2026 13:06 h",
      fechaEntrega: "15/10/2026 13:06 h",
      estado: "Pendiente",
      articulosResumen: "6 carpetas, 2 lápices",
      articulosCount: 8,
      total: 185.0,
    },
    {
      id: "P-00124",
      cliente: "mariana",
      contacto: "9981234567",
      fechaPedido: "14/10/2026 12:24 h",
      fechaEntrega: "21/10/2026 12:24 h",
      estado: "Pendiente",
      articulosResumen: "6 carpetas, 2 lápices",
      articulosCount: 8,
      total: 120.0,
    },
    {
      id: "P-00123",
      cliente: "roberto",
      contacto: "9987654321",
      fechaPedido: "14/10/2026 11:47 h",
      fechaEntrega: "17/10/2026 11:47 h",
      estado: "Pendiente",
      articulosResumen: "12 pegamentos en barra",
      articulosCount: 12,
      total: 264.0,
    },
    {
      id: "P-00122",
      cliente: "sofia",
      contacto: "9989876543",
      fechaPedido: "14/10/2026 10:32 h",
      fechaEntrega: "30/10/2026 10:32 h",
      estado: "Pendiente",
      articulosResumen: "3 tijeras escolares",
      articulosCount: 3,
      total: 75.0,
    },
    {
      id: "P-00121",
      cliente: "luis",
      contacto: "9981112233",
      fechaPedido: "14/10/2026 09:15 h",
      fechaEntrega: "24/10/2026 16:50 h",
      estado: "Pendiente",
      articulosResumen: "1 resma de papel, 5 lápices",
      articulosCount: 6,
      total: 125.0,
    },
  ];

  const handleOpenDetalle = (pedido: any) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Lista de Pedidos
        </h1>
        <p className="text-xs text-sky-700 font-semibold mt-0.5">
          Gestiona todas las listas de pedidos hechas desde la app mobile
        </p>
      </div>

      {/* Tarjetas de Estadísticas: 1 columna en celular, 3 desde tableta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Pedidos Pendientes
          </span>
          <span className="text-2xl font-extrabold text-slate-900">7</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            Requerirán confirmación o En espera en tienda.
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Pedidos completados del día
          </span>
          <span className="text-2xl font-extrabold text-slate-900">8</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            En ventas móviles o artículos apartados entregados.
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ticket promedio
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            $156.00
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            MXN por venta de hoy
          </span>
        </div>
      </div>

      {/* Buscador y Tabla */}
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="font-bold text-sm text-slate-900">Buscador</h2>
        </div>

        <div>
          <label
            htmlFor="buscar-pedido"
            className="block text-[11px] font-semibold text-slate-700 mb-1"
          >
            Buscar Pedido
          </label>
          <div className="relative flex items-center w-full max-w-md">
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
              id="buscar-pedido"
              type="text"
              placeholder="Buscar por identificador"
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300"
            />
          </div>
        </div>

        {/* ===== VISTA CELULAR: tarjetas (se ocultan desde 768 px) ===== */}
        <ul className="md:hidden space-y-3">
          {pedidosList.map((p) => (
            <li
              key={p.id}
              className="border border-sky-100 rounded-xl p-4 bg-sky-50/30"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-sky-700 text-sm">{p.id}</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${p.total.toFixed(2)}
                </span>
              </div>

              <div className="mt-2">
                <div className="font-bold text-slate-900 text-xs break-words">
                  {p.articulosResumen}
                </div>
                <div className="text-[10px] text-slate-500">
                  {p.articulosCount} artículos
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-[10px] font-semibold text-sky-800">
                    Fecha de pedido
                  </dt>
                  <dd className="text-slate-600">
                    {p.fechaPedido.split(" ")[0]}
                    <span className="block text-[10px] text-slate-400">
                      {p.fechaPedido.split(" ")[1]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold text-sky-800">
                    Fecha de entrega
                  </dt>
                  <dd className="text-slate-600">
                    {p.fechaEntrega.split(" ")[0]}
                    <span className="block text-[10px] text-slate-400">
                      {p.fechaEntrega.split(" ")[1]}
                    </span>
                  </dd>
                </div>
              </dl>

              <button
                onClick={() => handleOpenDetalle(p)}
                aria-label={`Ver detalle del pedido ${p.id}`}
                className="mt-4 w-full border border-sky-200 rounded-lg py-2.5 text-xs text-sky-700 font-semibold hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Ver detalle
              </button>
            </li>
          ))}
        </ul>

        {/* ===== VISTA TABLET/LAPTOP: tabla (visible desde 768 px) ===== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                <th scope="col" className="pb-3 pr-3">Identificador</th>
                <th scope="col" className="pb-3 pr-3">Fecha de pedido</th>
                <th scope="col" className="pb-3 pr-3">Artículos</th>
                <th scope="col" className="pb-3 pr-3">Fecha de Entrega</th>
                <th scope="col" className="pb-3 pr-3">Total (MXN)</th>
                <th scope="col" className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {pedidosList.map((p) => (
                <tr
                  key={p.id}
                  className="text-slate-800 hover:bg-sky-50/50 transition"
                >
                  <td className="py-3.5 pr-3 font-bold text-sky-700">{p.id}</td>
                  <td className="py-3.5 pr-3 text-slate-500">
                    <div>{p.fechaPedido.split(" ")[0]}</div>
                    <div className="text-[10px] text-slate-400">
                      {p.fechaPedido.split(" ")[1]}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="font-bold text-slate-900">
                      {p.articulosResumen}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {p.articulosCount} artículos
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-500">
                    <div>{p.fechaEntrega.split(" ")[0]}</div>
                    <div className="text-[10px] text-slate-400">
                      {p.fechaEntrega.split(" ")[1]}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-bold text-slate-900">
                    ${p.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleOpenDetalle(p)}
                      aria-label={`Ver detalle del pedido ${p.id}`}
                      className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-slate-500">
          <span>
            *Un pedido se cancela automáticamente al pasar 3 días sin respuesta
            del cliente
          </span>
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

      {/* Modal Flotante */}
      <PedidoDetalleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pedido={selectedPedido}
      />
    </div>
  );
};