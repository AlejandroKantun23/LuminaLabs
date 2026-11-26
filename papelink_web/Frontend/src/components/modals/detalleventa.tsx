import React, { useEffect } from "react";
import type { VentaApi } from "../../api/client";

type SaleDetailData = VentaApi & {
  date?: string;
  time?: string;
  itemsSummary?: string;
  itemCount?: number;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleDetailData | null;
  loading?: boolean;
  error?: string;
}

const formatFechaHora = (sale: SaleDetailData): { fecha: string; hora: string } => {
  if (sale.date) {
    return { fecha: sale.date, hora: sale.time ?? "" };
  }
  if (!sale.fecha_venta) return { fecha: "—", hora: "" };

  const parsed = new Date(sale.fecha_venta);
  if (isNaN(parsed.getTime())) return { fecha: sale.fecha_venta, hora: "" };

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

const formatMetodoPago = (metodo?: string): string => {
  if (!metodo) return "Efectivo";
  return metodo.charAt(0).toUpperCase() + metodo.slice(1);
};

export const DetalleVentaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sale,
  loading = false,
  error = "",
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !sale) return null;

  const identificador = `V-${String(sale.id).padStart(5, "0")}`;
  const { fecha, hora } = formatFechaHora(sale);
  const detalle = sale.detalle ?? [];
  const totalArticulos =
    detalle.length > 0
      ? detalle.reduce((sum, item) => sum + Number(item.cantidad || 0), 0)
      : Number(sale.itemCount ?? sale.articulos ?? 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de venta ${identificador}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto border border-sky-100 p-6 space-y-5"
      >
        {/* Encabezado */}
        <div className="flex justify-between items-start border-b border-sky-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-lg">
                Detalle de Venta {identificador}
              </h2>
              <span className="inline-block bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-lg">
                Completada
              </span>
            </div>
            {sale.ticket && (
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Ticket: {sale.ticket}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer px-1"
          >
            ✕
          </button>
        </div>

        {/* Datos generales de la venta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3">
            <span className="text-[10px] font-bold text-sky-800 block">
              Fecha y hora
            </span>
            <span className="font-semibold text-slate-800 block mt-0.5">
              {fecha} {hora ? `· ${hora}` : ""}
            </span>
          </div>
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3">
            <span className="text-[10px] font-bold text-sky-800 block">
              Atendió
            </span>
            <span className="font-semibold text-slate-800 block mt-0.5">
              {sale.atendio || "—"}
            </span>
          </div>
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3">
            <span className="text-[10px] font-bold text-sky-800 block">
              Método de pago
            </span>
            <span className="font-semibold text-slate-800 block mt-0.5">
              {formatMetodoPago(sale.metodo_pago)}
            </span>
          </div>
        </div>

        {/* Desglose de productos */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900">Productos vendidos</span>
            <span className="text-[11px] text-slate-500">
              {totalArticulos} {totalArticulos === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          {loading ? (
            <p className="py-6 text-center text-xs text-slate-400">
              Cargando detalle de productos...
            </p>
          ) : error ? (
            <p role="alert" className="py-4 text-center text-xs font-medium text-red-600">
              {error}
            </p>
          ) : detalle.length > 0 ? (
            <div className="overflow-x-auto border border-sky-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sky-50/70 border-b border-sky-100 text-sky-900 font-bold text-[11px]">
                    <th className="py-2.5 px-3">Producto</th>
                    <th className="py-2.5 px-3 text-center">Cant.</th>
                    <th className="py-2.5 px-3 text-right">P. Unit.</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {detalle.map((item) => (
                    <tr key={item.producto_id} className="text-slate-700">
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {item.nombre}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold">
                        {Number(item.cantidad)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        ${Number(item.precio_unitario || 0).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        ${Number(item.subtotal || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-slate-500 border border-dashed border-sky-200 rounded-xl">
              {sale.articulos_resumen ||
                sale.itemsSummary ||
                "Sin artículos registrados."}
            </p>
          )}
        </div>

        {/* Total y cierre */}
        <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-xs font-bold text-sky-950">Total cobrado</span>
          <span className="text-base font-extrabold text-sky-700">
            ${Number(sale.total || 0).toFixed(2)} MXN
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};