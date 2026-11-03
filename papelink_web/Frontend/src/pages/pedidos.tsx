import React, { useEffect, useMemo, useState } from "react";
import {
  cambiarEstadoPedido,
  cobrarPedido,
  getPedido,
  getPedidos,
  getResumenDia,
} from "../api/client";
import type { PedidoApi, ResumenDia } from "../api/client";
import { PedidoDetalleModal } from "../components/modals/detallepedido";

type PedidoModal = {
  id: string;
  backendId: number;
  cliente: string;
  contacto: string | null;
  fechaPedido: string;
  fechaEntrega: string;
  estado: string;
  estadoApi: PedidoApi["estado"];
  articulosResumen: string;
  articulosCount: number;
  total: number;
};

interface Props {
  refreshKey: number;
}

const stateLabels: Record<PedidoApi["estado"], string> = {
  pendiente: "Pendiente",
  confirmado_apartado: "Confirmado",
  listo_en_tienda: "Listo en tienda",
  completado: "Completado",
  cancelado: "Cancelado",
};

const dateTime = (value: string | null) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  return `${date.toLocaleDateString("es-MX")} ${date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  })} h`;
};

export const Pedidos: React.FC<Props> = ({ refreshKey }) => {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [summary, setSummary] = useState<ResumenDia | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<PedidoModal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    const [orderList, dailySummary] = await Promise.all([getPedidos(), getResumenDia()]);
    setPedidos(orderList);
    setSummary(dailySummary);
    setError("");
  };

  useEffect(() => {
    let active = true;
    Promise.all([getPedidos(), getResumenDia()])
      .then(([orderList, dailySummary]) => {
        if (active) {
          setPedidos(orderList);
          setSummary(dailySummary);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los pedidos.");
      });
    return () => { active = false; };
  }, [refreshKey]);

  const filteredPedidos = useMemo(() => pedidos.filter((pedido) => {
    const term = search.trim().toLowerCase();
    return !term || [
      pedido.folio,
      pedido.cliente,
      pedido.contacto ?? "",
    ].some((value) => value.toLowerCase().includes(term));
  }), [pedidos, search]);

  const pendingCount = pedidos.filter((pedido) =>
    ["pendiente", "confirmado_apartado", "listo_en_tienda"].includes(pedido.estado),
  ).length;

  const handleOpenDetalle = async (pedido: PedidoApi) => {
    try {
      const detail = await getPedido(pedido.id);
      setSelectedPedido({
        id: detail.folio,
        backendId: detail.id,
        cliente: detail.cliente,
        contacto: detail.contacto,
        fechaPedido: dateTime(detail.fecha_creacion),
        fechaEntrega: dateTime(detail.fecha_limite_recogida),
        estado: stateLabels[detail.estado],
        estadoApi: detail.estado,
        articulosResumen: detail.articulos_resumen ?? "Sin artículos",
        articulosCount: detail.articulos_count,
        total: detail.total,
      });
      setIsModalOpen(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el detalle del pedido.");
    }
  };

  const cancelOrder = async () => {
    if (!selectedPedido) return false;
    await cambiarEstadoPedido(selectedPedido.backendId, "cancelado");
    await loadData();
    return true;
  };

  const advanceOrder = async () => {
    if (!selectedPedido) return false;
    if (selectedPedido.estadoApi === "listo_en_tienda") {
      await cobrarPedido(selectedPedido.backendId, "efectivo");
    } else {
      const nextState: Partial<Record<PedidoApi["estado"], PedidoApi["estado"]>> = {
        pendiente: "confirmado_apartado",
        confirmado_apartado: "listo_en_tienda",
      };
      const next = nextState[selectedPedido.estadoApi];
      if (!next) return false;
      await cambiarEstadoPedido(selectedPedido.backendId, next);
    }
    await loadData();
    return true;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Lista de Pedidos</h1>
        <p className="text-xs text-sky-700 font-semibold mt-0.5">Gestiona todas las listas de pedidos hechas desde la app mobile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Pedidos Pendientes</span>
          <span className="text-2xl font-extrabold text-slate-900">{pendingCount}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">Requerirán confirmación o En espera en tienda.</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Pedidos completados del día</span>
          <span className="text-2xl font-extrabold text-slate-900">{summary?.pedidos_completados_hoy ?? 0}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">En ventas móviles o artículos apartados entregados.</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ticket promedio</span>
          <span className="text-2xl font-extrabold text-slate-900">${(summary?.ticket_promedio ?? 0).toFixed(2)}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">MXN por venta de hoy</span>
        </div>
      </div>

      {error && <p role="alert" className="mb-4 text-xs font-medium text-red-600">{error}</p>}

      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
        <div><h2 className="font-bold text-sm text-slate-900">Buscador</h2></div>
        <div>
          <label htmlFor="buscar-pedido" className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar Pedido</label>
          <div className="relative flex items-center w-full max-w-md">
            <span className="absolute left-3 text-sky-500" aria-hidden="true">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input id="buscar-pedido" type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por identificador" className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-300" />
          </div>
        </div>

        <ul className="md:hidden space-y-3">
          {filteredPedidos.map((pedido) => {
            const created = dateTime(pedido.fecha_creacion).split(" ");
            const pickup = pedido.fecha_limite_recogida
              ? dateTime(pedido.fecha_limite_recogida).split(" ")
              : ["Sin fecha", ""];
            return (
              <li key={pedido.id} className="border border-sky-100 rounded-xl p-4 bg-sky-50/30">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-bold text-sky-700 text-sm">{pedido.folio}</span>
                  <span className="font-bold text-slate-900 text-sm">${pedido.total.toFixed(2)}</span>
                </div>
                <div className="mt-2">
                  <div className="font-bold text-slate-900 text-xs break-words">{pedido.articulos_resumen ?? "Sin artículos"}</div>
                  <div className="text-[10px] text-slate-500">{pedido.articulos_count} artículos</div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div><dt className="text-[10px] font-semibold text-sky-800">Fecha de pedido</dt><dd className="text-slate-600">{created[0]}<span className="block text-[10px] text-slate-400">{created[1]}</span></dd></div>
                  <div><dt className="text-[10px] font-semibold text-sky-800">Fecha de entrega</dt><dd className="text-slate-600">{pickup[0]}<span className="block text-[10px] text-slate-400">{pickup[1]}</span></dd></div>
                </dl>
                <button onClick={() => handleOpenDetalle(pedido)} aria-label={`Ver detalle del pedido ${pedido.folio}`} className="mt-4 w-full border border-sky-200 rounded-lg py-2.5 text-xs text-sky-700 font-semibold hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">Ver detalle</button>
              </li>
            );
          })}
        </ul>

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
              {filteredPedidos.map((pedido) => {
                const created = dateTime(pedido.fecha_creacion).split(" ");
                const pickup = pedido.fecha_limite_recogida
                  ? dateTime(pedido.fecha_limite_recogida).split(" ")
                  : ["Sin fecha", ""];
                return (
                  <tr key={pedido.id} className="text-slate-800 hover:bg-sky-50/50 transition">
                    <td className="py-3.5 pr-3 font-bold text-sky-700">{pedido.folio}</td>
                    <td className="py-3.5 pr-3 text-slate-500"><div>{created[0]}</div><div className="text-[10px] text-slate-400">{created[1]}</div></td>
                    <td className="py-3.5 pr-3"><div className="font-bold text-slate-900">{pedido.articulos_resumen ?? "Sin artículos"}</div><div className="text-[10px] text-slate-500">{pedido.articulos_count} artículos</div></td>
                    <td className="py-3.5 pr-3 text-slate-500"><div>{pickup[0]}</div><div className="text-[10px] text-slate-400">{pickup[1]}</div></td>
                    <td className="py-3.5 pr-3 font-bold text-slate-900">${pedido.total.toFixed(2)}</td>
                    <td className="py-3.5 text-right"><button onClick={() => handleOpenDetalle(pedido)} aria-label={`Ver detalle del pedido ${pedido.folio}`} className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded">Ver detalle</button></td>
                  </tr>
                );
              })}
              {filteredPedidos.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-400">No se encontraron pedidos.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-slate-500">
          <span>*Un pedido se cancela automáticamente al pasar 3 días sin respuesta del cliente</span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button aria-label="Página anterior" className="border border-sky-200 rounded-lg px-3 py-1.5 text-sky-700 hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">&lt;</button>
              <button aria-label="Página siguiente" className="border border-sky-200 rounded-lg px-3 py-1.5 text-sky-700 hover:bg-sky-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      <PedidoDetalleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pedido={selectedPedido}
        onCancel={cancelOrder}
        onAdvance={advanceOrder}
      />
    </div>
  );
};
