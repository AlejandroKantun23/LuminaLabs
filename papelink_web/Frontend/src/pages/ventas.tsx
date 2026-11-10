import React, { useEffect, useMemo, useState } from "react";
import { getVentas } from "../api/client";
import type { VentaApi } from "../api/client";

interface Props {
  refreshKey?: number;
  onSelectVenta?: (venta: VentaApi) => void;
}

const getLocalISODate = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const Ventas: React.FC<Props> = ({ refreshKey = 0, onSelectVenta }) => {
  const todayISO = useMemo(() => getLocalISODate(), []);
  const todayDisplay = useMemo(
    () =>
      new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [],
  );

  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [searchId, setSearchId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>(todayISO);
  const [dateTo, setDateTo] = useState<string>(todayISO);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    let active = true;
    setLoading(true);
    getVentas()
      .then((data) => {
        if (active) {
          setVentas(Array.isArray(data) ? data : []);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las ventas.",
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

  const getRawDate = (v: any): string | undefined => v.fecha_venta ?? v.fecha;

  const getVentaDateISO = (v: any): string => {
    const raw = getRawDate(v);
    if (!raw) return todayISO;
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return raw.slice(0, 10);
    return getLocalISODate(parsed);
  };

  const formatIdentificador = (v: any): string => {
    return `V-${String(v.id).padStart(5, "0")}`;
  };

  const formatFechaHora = (v: any): { fecha: string; hora: string } => {
    const raw = getRawDate(v);
    if (!raw) return { fecha: todayDisplay, hora: "--:-- h" };
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return { fecha: raw, hora: "" };

    const fecha = parsed.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora =
      parsed.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " h";

    return { fecha, hora };
  };

  const resumenHoy = useMemo(() => {
    const ventasHoy = ventas.filter((v) => getVentaDateISO(v) === todayISO);

    const sumaTotalHoy = ventasHoy.reduce(
      (acc, v) => acc + Number(v.total || 0),
      0,
    );
    const cantidadVentasHoy = ventasHoy.length;
    const articulosVendidosHoy = ventasHoy.reduce(
      (acc, v) => acc + Number(v.articulos || 0),
      0,
    );
    const ticketPromedioHoy =
      cantidadVentasHoy > 0 ? sumaTotalHoy / cantidadVentasHoy : 0;

    return {
      sumaTotalHoy,
      cantidadVentasHoy,
      articulosVendidosHoy,
      ticketPromedioHoy,
    };
  }, [ventas, todayISO]);

  const ventasFiltradas = useMemo(() => {
    return [...ventas]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .filter((v) => {
        const query = searchId.trim().toLowerCase();
        const idV = formatIdentificador(v).toLowerCase();
        const ticketT = (v.ticket ?? "").toLowerCase();
        const matchesId =
          !query || idV.includes(query) || ticketT.includes(query);

        const fechaISO = getVentaDateISO(v);
        const matchesFrom = !dateFrom || fechaISO >= dateFrom;
        const matchesTo = !dateTo || fechaISO <= dateTo;

        return matchesId && matchesFrom && matchesTo;
      });
  }, [ventas, searchId, dateFrom, dateTo]);

  const totalPeriodoMonto = ventasFiltradas.reduce(
    (acc, v) => acc + Number(v.total || 0),
    0,
  );
  const totalPeriodoArticulos = ventasFiltradas.reduce(
    (acc, v) => acc + Number(v.articulos || 0),
    0,
  );

  const totalPages = Math.max(
    1,
    Math.ceil(ventasFiltradas.length / itemsPerPage),
  );
  const ventasPaginadas = ventasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Ventas</h1>
        <p className="text-xs text-sky-700 font-semibold mt-0.5">
          Consulta y registra las ventas de tu papelería.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ventas de hoy
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            ${resumenHoy.sumaTotalHoy.toFixed(2)}
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            MXN · {todayDisplay}
          </span>
        </div>

        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ventas registradas
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            {resumenHoy.cantidadVentasHoy}
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            {resumenHoy.articulosVendidosHoy} artículos vendidos hoy
          </span>
        </div>

        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ticket promedio
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            ${resumenHoy.ticketPromedioHoy.toFixed(2)}
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            MXN por venta de hoy
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-5">
        <div>
          <h2 className="font-bold text-sm text-slate-900">
            Registro de ventas
          </h2>
          <p className="text-[11px] text-sky-700 font-medium mt-0.5">
            {todayDisplay} · Más recientes primero
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Buscar venta
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sky-500">
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
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por identificador"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-sky-100 text-sky-800 font-bold text-[11px]">
                <th className="pb-3">Identificador</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Artículos</th>
                <th className="pb-3 text-right">Total (MXN)</th>
                <th className="pb-3 text-center">Estado</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Cargando ventas...
                  </td>
                </tr>
              ) : ventasPaginadas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No hay ventas en este período.
                  </td>
                </tr>
              ) : (
                ventasPaginadas.map((venta) => {
                  const { fecha, hora } = formatFechaHora(venta);
                  const cantidadArticulos = Number(venta.articulos || 0);
                  const resumenArticulos =
                    venta.articulos_resumen || `${cantidadArticulos} artículos`;

                  return (
                    <tr
                      key={venta.id}
                      className="hover:bg-sky-50/40 transition"
                    >
                      <td className="py-4 font-bold text-slate-900">
                        {formatIdentificador(venta)}
                      </td>
                      <td className="py-4">
                        <div className="text-slate-800 font-medium">
                          {fecha}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {hora}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-slate-800 font-medium">
                          {resumenArticulos}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {cantidadArticulos}{" "}
                          {cantidadArticulos === 1 ? "artículo" : "artículos"}
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-slate-900">
                        ${Number(venta.total || 0).toFixed(2)}
                      </td>
                      <td className="py-4 text-center">
                        <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-3 py-1 rounded-lg">
                          Completada
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectVenta && onSelectVenta(venta)}
                          className="text-xs text-slate-700 hover:text-sky-700 underline cursor-pointer font-medium"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl px-4 py-3 flex justify-between items-center text-xs font-bold text-sky-950">
          <span>
            Total del período · {ventasFiltradas.length}{" "}
            {ventasFiltradas.length === 1 ? "venta" : "ventas"} ·{" "}
            {totalPeriodoArticulos}{" "}
            {totalPeriodoArticulos === 1 ? "artículo" : "artículos"}
          </span>
          <span>${totalPeriodoMonto.toFixed(2)} MXN</span>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
          <span>
            Mostrando {ventasPaginadas.length} de {ventasFiltradas.length}{" "}
            ventas
          </span>
          <div className="flex items-center gap-2">
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-6 h-6 flex items-center justify-center rounded-md border border-sky-200 text-sky-700 disabled:opacity-40 cursor-pointer"
            >
              &lt;
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-6 h-6 flex items-center justify-center rounded-md border border-sky-200 text-sky-700 disabled:opacity-40 cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
