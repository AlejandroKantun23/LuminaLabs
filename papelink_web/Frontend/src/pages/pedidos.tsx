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
  onOrderChanged?: () => void;
}

const stateLabels: Record<PedidoApi["estado"], string> = {
  pendiente: "Pendiente",
  confirmado_apartado: "Confirmado",
  listo_en_tienda: "Listo en tienda",
  completado: "Completado",
  cancelado: "Cancelado",
};

const stateStyles: Record<PedidoApi["estado"], string> = {
  pendiente: "bg-amber-100 text-amber-800 border border-amber-200",
  confirmado_apartado: "bg-sky-100 text-sky-800 border border-sky-200",
  listo_en_tienda: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  completado: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  cancelado: "bg-rose-100 text-rose-700 border border-rose-200",
};

const dateTime = (value: string | null) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString("es-MX")} ${date.toLocaleTimeString(
    "es-MX",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  )} h`;
};

export const Pedidos: React.FC<Props> = ({ refreshKey, onOrderChanged }) => {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [summary, setSummary] = useState<ResumenDia | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<PedidoModal | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("activos");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 8;

  const loadData = async () => {
    const [orderList, dailySummary] = await Promise.all([
      getPedidos(),
      getResumenDia(),
    ]);
    setPedidos(Array.isArray(orderList) ? orderList : []);
    setSummary(dailySummary);
    setError("");
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getPedidos(), getResumenDia()])
      .then(([orderList, dailySummary]) => {
        if (active) {
          setPedidos(Array.isArray(orderList) ? orderList : []);
          setSummary(dailySummary);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar los pedidos.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const filteredPedidos = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pedidos.filter((pedido) => {
      const matchesSearch =
        !term ||
        [
          pedido.folio,
          pedido.cliente,
          pedido.contacto ?? "",
          pedido.articulos_resumen ?? "",
        ].some((value) => value.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "todos"
          ? true
          : statusFilter === "activos"
            ? ["pendiente", "confirmado_apartado", "listo_en_tienda"].includes(
                pedido.estado,
              )
            : pedido.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [pedidos, search, statusFilter]);

  const pendingCount = pedidos.filter((pedido) =>
    ["pendiente", "confirmado_apartado", "listo_en_tienda"].includes(
      pedido.estado,
    ),
  ).length;

  const readyCount = pedidos.filter(
    (pedido) => pedido.estado === "listo_en_tienda",
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPedidos.length / itemsPerPage),
  );
  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
        articulosCount: Number(detail.articulos_count ?? 0),
        total: Number(detail.total ?? 0),
      });
      setIsModalOpen(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar el detalle del pedido.",
      );
    }
  };

  const cancelOrder = async () => {
    if (!selectedPedido) return false;
    await cambiarEstadoPedido(selectedPedido.backendId, "cancelado");
    await loadData();
    onOrderChanged?.();
    return true;
  };

  const advanceOrder = async () => {
    if (!selectedPedido) return false;
    if (selectedPedido.estadoApi === "listo_en_tienda") {
      await cobrarPedido(selectedPedido.backendId, "efectivo");
    } else {
      const nextState: Partial<
        Record<PedidoApi["estado"], PedidoApi["estado"]>
      > = {
        pendiente: "confirmado_apartado",
        confirmado_apartado: "listo_en_tienda",
      };
      const next = nextState[selectedPedido.estadoApi];
      if (!next) return false;
      await cambiarEstadoPedido(selectedPedido.backendId, next);
    }
    await loadData();
    onOrderChanged?.();
    return true;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Pedidos desde App Móvil
        </h1>
        <p className="text-xs text-sky-700 font-semibold mt-0.5">
          Confirma, prepara y cobra los apartados realizados por clientes desde la aplicación móvil.
        </p>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            Pedidos Activos
          </span>
          <span className="text-2xl font-extrabold text-amber-600">
            {pendingCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            En espera de confirmación o entrega en tienda
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            Listos para cobrar
          </span>
          <span className="text-2xl font-extrabold text-sky-700">
            {readyCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Stock ya apartado; listos para entrega al cliente
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold block mb-1">
            Completados hoy
          </span>
          <span className="text-2xl font-extrabold text-emerald-700">
            {summary?.pedidos_completados_hoy ?? 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Apartados cobrados y entregados hoy
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}

      {/* Buscador, Filtros y Tabla */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <label
              htmlFor="buscar-pedido"
              className="block text-[11px] font-bold text-slate-700 mb-1"
            >
              Buscar pedido
            </label>
            <input
              id="buscar-pedido"
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por folio, cliente, contacto o producto..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-6">
            <label
              htmlFor="filtro-estado-pedido"
              className="block text-[11px] font-bold text-slate-700 mb-1"
            >
              Filtrar por estado
            </label>
            <select
              id="filtro-estado-pedido"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            >
              <option value="activos">Solo activos (Pendientes / En tienda)</option>
              <option value="todos">Todos los pedidos</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado_apartado">Confirmado</option>
              <option value="listo_en_tienda">Listo en tienda</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Vista móvil */}
        <ul className="md:hidden space-y-3">
          {paginatedPedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-extrabold text-sky-700 text-sm">
                  {pedido.folio}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stateStyles[pedido.estado]}`}
                >
                  {stateLabels[pedido.estado]}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                {pedido.cliente}{" "}
                <span className="font-normal text-slate-500">
                  · ${Number(pedido.total || 0).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-slate-700">
                {pedido.articulos_resumen ?? "Sin artículos"} (
                {Number(pedido.articulos_count ?? 0)} art.)
              </div>
              <button
                type="button"
                onClick={() => void handleOpenDetalle(pedido)}
                className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg py-2 text-xs font-bold cursor-pointer"
              >
                Gestionar pedido
              </button>
            </li>
          ))}
        </ul>

        {/* Vista escritorio */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sky-800 font-bold text-[11px] uppercase">
                <th scope="col" className="pb-3 pr-3">Folio</th>
                <th scope="col" className="pb-3 pr-3">Cliente</th>
                <th scope="col" className="pb-3 pr-3">Artículos</th>
                <th scope="col" className="pb-3 pr-3">Fecha límite</th>
                <th scope="col" className="pb-3 pr-3 text-center">Estado</th>
                <th scope="col" className="pb-3 pr-3 text-right">Total (MXN)</th>
                <th scope="col" className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : paginatedPedidos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No se encontraron pedidos con este filtro.
                  </td>
                </tr>
              ) : (
                paginatedPedidos.map((pedido) => {
                  const pickup = pedido.fecha_limite_recogida
                    ? dateTime(pedido.fecha_limite_recogida)
                    : "Sin fecha";
                  return (
                    <tr
                      key={pedido.id}
                      className="text-slate-800 hover:bg-sky-50/50 transition"
                    >
                      <td className="py-3.5 pr-3 font-mono font-extrabold text-sky-700">
                        {pedido.folio}
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-slate-900">
                          {pedido.cliente}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {pedido.contacto ?? "Sin teléfono"}
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="font-semibold text-slate-900">
                          {pedido.articulos_resumen ?? "Sin artículos"}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {Number(pedido.articulos_count ?? 0)} artículos
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 text-slate-600 text-[11px]">
                        {pickup}
                      </td>
                      <td className="py-3.5 pr-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${stateStyles[pedido.estado]}`}
                        >
                          {stateLabels[pedido.estado]}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-right font-extrabold text-slate-900">
                        ${Number(pedido.total || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => void handleOpenDetalle(pedido)}
                          className="text-xs text-sky-700 hover:underline font-bold cursor-pointer"
                        >
                          Ver / Cobrar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pie y paginación real */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-[11px] text-slate-500">
          <span>
            *Un pedido se cancela automáticamente al pasar 3 días sin recogerlo (devuelve el stock).
          </span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 disabled:opacity-40 cursor-pointer"
            >
              &lt;
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 disabled:opacity-40 cursor-pointer"
            >
              &gt;
            </button>
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