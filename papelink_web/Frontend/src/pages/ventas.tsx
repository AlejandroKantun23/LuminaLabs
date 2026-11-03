import React, { useEffect, useMemo, useState } from 'react';
import { getResumenDia, getVenta, getVentas } from '../api/client';
import type { ResumenDia, VentaApi } from '../api/client';
import { DetalleVentaModal } from '../components/modals/detalleventa';

type SaleRow = {
  id: number;
  ticket: string;
  date: string;
  time: string;
  itemsSummary: string;
  itemCount: number;
  total: number;
  status: string;
  detalle?: VentaApi['detalle'];
};

interface Props {
  refreshKey: number;
}

const dateForApi = (date: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : undefined;
};

const formatSaleDate = (value: string) => {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString('es-MX'),
    time: `${date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} h`,
  };
};

const toDateText = (date: Date) => date.toLocaleDateString('es-MX', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const Ventas: React.FC<Props> = ({ refreshKey }) => {
  const [today] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState<'hoy' | 'semana' | 'mes'>('hoy');
  const [selectedSale, setSelectedSale] = useState<SaleRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sales, setSales] = useState<VentaApi[]>([]);
  const [summary, setSummary] = useState<ResumenDia | null>(null);
  const [search, setSearch] = useState('');
  const [desde, setDesde] = useState(() => toDateText(today));
  const [hasta, setHasta] = useState(() => toDateText(today));
  const [error, setError] = useState('');

  const updateDateRange = (nextDesde: string, nextHasta: string) => {
    setDesde(nextDesde);
    setHasta(nextHasta);
    const to = dateForApi(nextHasta);
    const nextFrom = dateForApi(nextDesde);
    if (!nextFrom || !to) {
      setError('Usa el formato de fecha DD/MM/AAAA.');
    } else if (nextFrom > to) {
      setError('La fecha inicial no puede ser posterior a la fecha final.');
    } else {
      setError('');
    }
  };

  useEffect(() => {
    const from = dateForApi(desde);
    const to = dateForApi(hasta);
    if (!from || !to || from > to) return;
    let active = true;
    Promise.all([getVentas(from, to), getResumenDia()])
      .then(([salesList, dailySummary]) => {
        if (active) {
          setSales(salesList);
          setSummary(dailySummary);
          setError('');
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las ventas.');
      });
    return () => { active = false; };
  }, [desde, hasta, refreshKey]);

  const filteredSales = useMemo(() => sales.filter((sale) =>
    sale.ticket.toLowerCase().includes(search.trim().toLowerCase()),
  ), [sales, search]);
  const periodTotal = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const periodItems = filteredSales.reduce((sum, sale) => sum + sale.articulos, 0);
  const periodLabel = activeTab === 'hoy'
    ? toDateText(today)
    : activeTab === 'semana' ? 'Esta semana' : 'Este mes';

  const selectPeriod = (period: 'hoy' | 'semana' | 'mes') => {
    setActiveTab(period);
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    if (period === 'semana') {
      start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    } else if (period === 'mes') {
      start.setDate(1);
    }
    setDesde(toDateText(start));
    setHasta(toDateText(end));
  };

  const handleOpenDetalle = async (sale: VentaApi) => {
    try {
      const detail = await getVenta(sale.id);
      const dateAndTime = formatSaleDate(detail.fecha_venta);
      setSelectedSale({
        id: detail.id,
        ticket: detail.ticket,
        date: dateAndTime.date,
        time: dateAndTime.time,
        itemsSummary: detail.detalle?.map((item) => `${item.cantidad} ${item.nombre.toLowerCase()}`).join(', ') ?? '',
        itemCount: detail.articulos,
        total: detail.total,
        status: 'Completada',
        detalle: detail.detalle,
      });
      setIsModalOpen(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el detalle de la venta.');
    }
  };

  return (
    <div className="p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Ventas</h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">Consulta y registra las ventas de tu papelería.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ventas de hoy</span>
          <span className="text-2xl font-extrabold text-slate-900">${(summary?.ventas_hoy ?? 0).toFixed(2)}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">MXN · {toDateText(today)}</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ventas registradas</span>
          <span className="text-2xl font-extrabold text-slate-900">{summary?.ventas_registradas ?? 0}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">{summary?.articulos_vendidos ?? 0} artículos vendidos hoy</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Ticket promedio</span>
          <span className="text-2xl font-extrabold text-slate-900">${(summary?.ticket_promedio ?? 0).toFixed(2)}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">MXN por venta de hoy</span>
        </div>
      </div>

      {error && <p role="alert" className="mb-4 text-xs font-medium text-red-600">{error}</p>}

      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Registro de ventas</h3>
            <p className="text-[10px] text-sky-700 font-medium mt-0.5">{periodLabel} · Más recientes primero</p>
          </div>
          <div className="bg-sky-50/80 p-1 rounded-xl flex text-xs border border-sky-200/60">
            <button onClick={() => selectPeriod('hoy')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${activeTab === 'hoy' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'}`}>Hoy</button>
            <button onClick={() => selectPeriod('semana')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${activeTab === 'semana' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'}`}>Esta semana</button>
            <button onClick={() => selectPeriod('mes')} className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${activeTab === 'mes' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-sky-700'}`}>Este mes</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar venta</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sky-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por identificador" className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Desde</label>
            <input type="text" value={desde} onChange={(event) => updateDateRange(event.target.value, hasta)} className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hasta</label>
            <input type="text" value={hasta} onChange={(event) => updateDateRange(desde, event.target.value)} className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                <th className="pb-3">Identificador</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Artículos</th>
                <th className="pb-3">Total (MXN)</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {filteredSales.map((sale) => {
                const dateAndTime = formatSaleDate(sale.fecha_venta);
                return (
                  <tr key={sale.id} className="text-slate-800 hover:bg-sky-50/50 transition">
                    <td className="py-3.5 font-bold text-sky-700">{sale.ticket}</td>
                    <td className="py-3.5 text-slate-500">
                      <div>{dateAndTime.date}</div>
                      <div className="text-[10px] text-slate-400">{dateAndTime.time}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">{sale.articulos} artículos</div>
                      <div className="text-[10px] text-slate-500">Pago: {sale.metodo_pago}</div>
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">${sale.total.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 inline-block">Completada</span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button onClick={() => handleOpenDetalle(sale)} className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer">Ver detalle</button>
                    </td>
                  </tr>
                );
              })}
              {filteredSales.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">No hay ventas en este período.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="py-3 px-4 bg-gradient-to-r from-sky-100/70 to-sky-50/80 rounded-xl flex justify-between items-center text-xs font-extrabold text-sky-900 border border-sky-200/80">
          <span>Total del período · {filteredSales.length} ventas · {periodItems} artículos</span>
          <span>${periodTotal.toFixed(2)} MXN</span>
        </div>
        <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
          <span>Mostrando {filteredSales.length} de {sales.length} ventas</span>
          <div className="flex items-center gap-2">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&lt;</button>
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      <DetalleVentaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sale={selectedSale}
      />
    </div>
  );
};
