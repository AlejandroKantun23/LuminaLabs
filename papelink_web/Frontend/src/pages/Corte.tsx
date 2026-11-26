import React, { useEffect, useMemo, useState } from "react";
import { getVentas } from "../api/client";
import type { VentaApi } from "../api/client";

interface MovimientoCaja {
  id: number;
  tipo: "entrada" | "salida";
  monto: number;
  concepto: string;
  hora: string;
}

interface Props {
  refreshKey?: number;
}

const getLocalISODate = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const CorteCaja: React.FC<Props> = ({ refreshKey = 0 }) => {
  const todayISO = useMemo(() => getLocalISODate(), []);
  const storageKey = `papelink_caja_${todayISO}`;

  const [ventasHoy, setVentasHoy] = useState<VentaApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [fondoInicial, setFondoInicial] = useState<number>(() => {
    const saved = localStorage.getItem(`${storageKey}_fondo`);
    return saved ? Number(saved) || 0 : 500;
  });
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>(() => {
    try {
      const raw = localStorage.getItem(`${storageKey}_movs`);
      return raw ? (JSON.parse(raw) as MovimientoCaja[]) : [];
    } catch {
      return [];
    }
  });

  // Formulario de entrada / salida
  const [tipoMov, setTipoMov] = useState<"entrada" | "salida">("salida");
  const [montoMov, setMontoMov] = useState("");
  const [conceptoMov, setConceptoMov] = useState("");

  // Arqueo físico
  const [efectivoContado, setEfectivoContado] = useState("");
  const [corteConfirmado, setCorteConfirmado] = useState(false);

  useEffect(() => {
    localStorage.setItem(`${storageKey}_fondo`, String(fondoInicial));
  }, [fondoInicial, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}_movs`, JSON.stringify(movimientos));
  }, [movimientos, storageKey]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getVentas(todayISO, todayISO)
      .then((data) => {
        if (active) setVentasHoy(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [todayISO, refreshKey]);

  const ventasEfectivo = ventasHoy
    .filter((v) => v.metodo_pago === "efectivo")
    .reduce((s, v) => s + Number(v.total || 0), 0);
  const ventasTarjeta = ventasHoy
    .filter((v) => v.metodo_pago === "tarjeta")
    .reduce((s, v) => s + Number(v.total || 0), 0);
  const ventasTransferencia = ventasHoy
    .filter((v) => v.metodo_pago === "transferencia")
    .reduce((s, v) => s + Number(v.total || 0), 0);

  const totalEntradas = movimientos
    .filter((m) => m.tipo === "entrada")
    .reduce((s, m) => s + m.monto, 0);
  const totalSalidas = movimientos
    .filter((m) => m.tipo === "salida")
    .reduce((s, m) => s + m.monto, 0);

  const efectivoEsperado =
    fondoInicial + ventasEfectivo + totalEntradas - totalSalidas;
  const totalVentasDia = ventasEfectivo + ventasTarjeta + ventasTransferencia;
  const contadoNum = parseFloat(efectivoContado);
  const diferencia = isNaN(contadoNum) ? null : contadoNum - efectivoEsperado;

  const handleAgregarMovimiento = (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(montoMov);
    if (!monto || monto <= 0 || !conceptoMov.trim()) return;
    setMovimientos([
      {
        id: Date.now(),
        tipo: tipoMov,
        monto,
        concepto: conceptoMov.trim(),
        hora: new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      },
      ...movimientos,
    ]);
    setMontoMov("");
    setConceptoMov("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">
          Corte de Caja (F4)
        </h1>
        <p className="text-xs text-sky-700 font-semibold">
          Arqueo de efectivo, desglose por método de pago y movimientos del turno ({todayISO}).
        </p>
      </div>

      {/* Desglose de ventas del día */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 block">
            Ventas en Efectivo
          </span>
          <span className="text-2xl font-extrabold text-emerald-700">
            {loading ? "..." : `$${ventasEfectivo.toFixed(2)}`}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 block">
            Ventas con Tarjeta
          </span>
          <span className="text-2xl font-extrabold text-sky-700">
            {loading ? "..." : `$${ventasTarjeta.toFixed(2)}`}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 block">
            Transferencias
          </span>
          <span className="text-2xl font-extrabold text-indigo-700">
            {loading ? "..." : `$${ventasTransferencia.toFixed(2)}`}
          </span>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-400 block">
            Total Ventas Hoy ({ventasHoy.length})
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400">
            {loading ? "..." : `$${totalVentasDia.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel izquierdo: Arqueo de efectivo */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Dinero en Caja
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-600">
                Fondo inicial de caja
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fondoInicial}
                onChange={(e) => setFondoInicial(Number(e.target.value) || 0)}
                className="w-28 text-right border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-900"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">+ Ventas en efectivo</span>
              <span className="font-bold text-emerald-700">
                ${ventasEfectivo.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">+ Entradas de efectivo</span>
              <span className="font-bold text-sky-700">
                ${totalEntradas.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">− Salidas / gastos</span>
              <span className="font-bold text-rose-600">
                ${totalSalidas.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-sm font-extrabold">
              <span className="text-slate-900">Efectivo esperado en caja</span>
              <span className="text-sky-700 font-mono text-lg">
                ${efectivoEsperado.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label
                htmlFor="efectivo-contado"
                className="font-bold text-slate-800"
              >
                Efectivo contado en caja ($)
              </label>
              <input
                id="efectivo-contado"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={efectivoContado}
                onChange={(e) => {
                  setEfectivoContado(e.target.value);
                  setCorteConfirmado(false);
                }}
                className="w-32 text-right bg-white border-2 border-sky-300 rounded-lg px-2.5 py-1.5 font-extrabold text-slate-900 focus:outline-none focus:border-sky-600"
              />
            </div>

            {diferencia !== null && (
              <div
                className={`text-xs font-bold flex justify-between pt-2 border-t border-sky-200 ${
                  Math.abs(diferencia) < 0.01
                    ? "text-emerald-700"
                    : diferencia > 0
                    ? "text-sky-700"
                    : "text-rose-600"
                }`}
              >
                <span>
                  {Math.abs(diferencia) < 0.01
                    ? "Caja cuadrada"
                    : diferencia > 0
                    ? "Sobrante"
                    : "Faltante"}
                </span>
                <span className="font-mono">
                  {diferencia >= 0 ? "+" : ""}${diferencia.toFixed(2)}
                </span>
              </div>
            )}

            <button
              type="button"
              disabled={diferencia === null}
              onClick={() => setCorteConfirmado(true)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-extrabold rounded-lg transition cursor-pointer"
            >
              Registrar Corte del Turno
            </button>

            {corteConfirmado && (
              <p className="text-xs font-bold text-emerald-700 text-center">
                Corte del día validado correctamente.
              </p>
            )}
          </div>
        </div>

        {/* Panel derecho: Entradas y Salidas de efectivo */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Entradas y Salidas de Efectivo
          </h2>

          <form onSubmit={handleAgregarMovimiento} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoMov("entrada")}
                className={`py-2 rounded-lg font-bold border cursor-pointer ${
                  tipoMov === "entrada"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                + Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipoMov("salida")}
                className={`py-2 rounded-lg font-bold border cursor-pointer ${
                  tipoMov === "salida"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                − Salida / Gasto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="Monto ($)"
                value={montoMov}
                onChange={(e) => setMontoMov(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 font-bold"
              />
              <input
                type="text"
                required
                placeholder="Concepto (ej. Pago proveedor)"
                value={conceptoMov}
                onChange={(e) => setConceptoMov(e.target.value)}
                className="sm:col-span-2 border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
            >
              Guardar movimiento
            </button>
          </form>

          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto text-xs">
            {movimientos.length === 0 ? (
              <p className="py-6 text-center text-slate-400">
                Sin entradas ni salidas registradas hoy.
              </p>
            ) : (
              movimientos.map((m) => (
                <div
                  key={m.id}
                  className="py-2.5 flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {m.concepto}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.hora} h</span>
                  </div>
                  <span
                    className={`font-extrabold font-mono ${
                      m.tipo === "entrada" ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {m.tipo === "entrada" ? "+" : "−"}${m.monto.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};