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
    <div className="p-8 bg-[#F8F9FA] min-h-[calc(100vh-4rem)] select-none">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lista de Pedidos</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Gestiona todas las listas de pedidos hechas desde la app mobile
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">
            Pedidos Pendientes
          </span>
          <span className="text-2xl font-bold text-gray-900">7</span>
          <span className="text-[10px] text-gray-400 block mt-1">
            Requerirán confirmación o En espera en tienda.
          </span>
        </div>
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">
            Pedidos completados del día
          </span>
          <span className="text-2xl font-bold text-gray-900">8</span>
          <span className="text-[10px] text-gray-400 block mt-1">
            En ventas móviles o artículos apartados entregados.
          </span>
        </div>
        <div className="bg-white border border-gray-200/80 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] text-gray-500 font-medium block mb-1">
            Ticket promedio
          </span>
          <span className="text-2xl font-bold text-gray-900">$156.00</span>
          <span className="text-[10px] text-gray-400 block mt-1">
            MXN por venta de hoy
          </span>
        </div>
      </div>

      {/* Contenedor Principal / Buscador y Tabla */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-gray-900">Buscador</h3>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
            Buscar Pedido
          </label>
          <div className="relative flex items-center max-w-md">
            <span className="absolute left-3 text-gray-400">
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
              type="text"
              placeholder="Buscar por identificador"
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[11px]">
              <th className="pb-3 font-medium">Identificador</th>
              <th className="pb-3 font-medium">Fecha de pedido</th>
              <th className="pb-3 font-medium">Artículos</th>
              <th className="pb-3 font-medium">Fecha de Entrega</th>
              <th className="pb-3 font-medium">Total (MXN)</th>
              <th className="pb-3 font-medium text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedidosList.map((p) => (
              <tr key={p.id} className="text-gray-800">
                <td className="py-3.5 font-bold text-gray-900">{p.id}</td>
                <td className="py-3.5 text-gray-500">
                  <div>{p.fechaPedido.split(" ")[0]}</div>
                  <div className="text-[10px] text-gray-400">
                    {p.fechaPedido.split(" ")[1]}
                  </div>
                </td>
                <td className="py-3.5">
                  <div className="font-medium text-gray-900">
                    {p.articulosResumen}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {p.articulosCount} artículos
                  </div>
                </td>
                <td className="py-3.5 text-gray-500">
                  <div>{p.fechaEntrega.split(" ")[0]}</div>
                  <div className="text-[10px] text-gray-400">
                    {p.fechaEntrega.split(" ")[1]}
                  </div>
                </td>
                <td className="py-3.5 font-bold text-gray-900">
                  ${p.total.toFixed(2)}
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => handleOpenDetalle(p)}
                    className="text-xs text-gray-900 hover:underline font-medium cursor-pointer"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Nota inferior y Paginación */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>
            *Un pedido se cancela automáticamente al pasar 3 días sin respuesta
            del cliente
          </span>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button className="border border-gray-200 rounded px-2 py-1 text-gray-400 hover:bg-gray-50">
                &lt;
              </button>
              <button className="border border-gray-200 rounded px-2 py-1 text-gray-400 hover:bg-gray-50">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Flotante de Detalle de Pedido */}
      <PedidoDetalleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pedido={selectedPedido}
      />
    </div>
  );
};
