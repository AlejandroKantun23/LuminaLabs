import React, { useEffect, useMemo, useState } from "react";
import { ajustarStock, getInventario } from "../api/client";
import type { ProductoApi } from "../api/client";
import { EstadoInventarioModal } from "../components/modals/agregarinventario";
import { EditarExistenciaModal } from "../components/modals/editarexistencia";

interface Props {
  refreshKey?: number;
  onInventoryChanged?: () => void;
}

export const Inventario: React.FC<Props> = ({
  refreshKey = 0,
  onInventoryChanged,
}) => {
  const [products, setProducts] = useState<ProductoApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localRefresh, setLocalRefresh] = useState(0);

  // Filtros
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");

  // Modales integrados directamente en Inventario
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoApi | null>(null);
  const [stockProduct, setStockProduct] = useState<ProductoApi | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getInventario()
      .then((data) => {
        if (active) {
          setProducts(Array.isArray(data) ? data : []);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el inventario.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey, localRefresh]);

  const triggerReload = () => {
    setLocalRefresh((n) => n + 1);
    onInventoryChanged?.();
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.categoria)));
    return ["Todas", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchText =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        (p.codigo_barras ?? "").toLowerCase().includes(q);
      const matchCat =
        categoryFilter === "Todas" || p.categoria === categoryFilter;
      const matchStatus =
        statusFilter === "Todos" || p.estatus === statusFilter;
      return matchText && matchCat && matchStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const totalUnits = products.reduce((s, p) => s + Number(p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.estatus === "Stock bajo").length;
  const outStockCount = products.filter(
    (p) => p.estatus === "Sin existencias",
  ).length;
  const totalValue = products.reduce(
    (s, p) => s + Number(p.precio || 0) * Number(p.stock || 0),
    0,
  );

  const handleQuickStep = async (product: ProductoApi, delta: number) => {
    const next = Math.max(0, Number(product.stock || 0) + delta);
    try {
      await ajustarStock(product.id, next);
      triggerReload();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudo ajustar el stock.",
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Encabezado con botón directo de + Nuevo producto */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Inventario
          </h1>
          <p className="text-xs text-sky-700 font-semibold">
            Agrega productos nuevos, edita precios y controla existencias en tiempo real.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Tarjetas KPI de inventario */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 block">
            Productos activos
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            {products.length}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 block">
            Unidades en almacén
          </span>
          <span className="text-2xl font-extrabold text-sky-700">
            {totalUnits}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 block">
            Alertas de stock
          </span>
          <span className="text-2xl font-extrabold text-amber-600">
            {lowStockCount + outStockCount}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {lowStockCount} bajos · {outStockCount} agotados
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[11px] font-bold text-slate-500 block">
            Valor en inventario
          </span>
          <span className="text-2xl font-extrabold text-emerald-700">
            ${totalValue.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}

      {/* Filtros y Tabla */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, SKU o código de barras..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Categoría: {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="Todos">Estatus: Todos</option>
              <option value="Disponible">Disponible</option>
              <option value="Stock bajo">Stock bajo</option>
              <option value="Sin existencias">Sin existencias</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[740px]">
            <thead>
              <tr className="border-b border-slate-200 text-sky-800 font-bold text-[11px] uppercase">
                <th className="py-2.5 px-2">SKU / Código</th>
                <th className="py-2.5 px-2">Producto</th>
                <th className="py-2.5 px-2">Categoría</th>
                <th className="py-2.5 px-2 text-right">Precio</th>
                <th className="py-2.5 px-2 text-center">Existencia</th>
                <th className="py-2.5 px-2 text-center">Estatus</th>
                <th className="py-2.5 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Cargando inventario...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No se encontraron productos con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const statusStyle =
                    prod.estatus === "Sin existencias"
                      ? "bg-rose-100 text-rose-700"
                      : prod.estatus === "Stock bajo"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800";

                  return (
                    <tr key={prod.id} className="hover:bg-sky-50/40 transition">
                      <td className="py-3 px-2 font-mono font-bold text-sky-800">
                        {prod.sku ?? prod.codigo_barras ?? `#${prod.id}`}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-bold text-slate-900">
                          {prod.nombre}
                        </div>
                        {prod.descripcion && (
                          <div className="text-[10px] text-slate-500">
                            {prod.descripcion}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {prod.categoria}
                      </td>
                      <td className="py-3 px-2 text-right font-extrabold text-slate-900">
                        ${Number(prod.precio || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => void handleQuickStep(prod, -1)}
                            className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-9 text-center font-extrabold text-slate-900">
                            {prod.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => void handleQuickStep(prod, 1)}
                            className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusStyle}`}
                        >
                          {prod.estatus ?? "Disponible"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setStockProduct(prod)}
                          className="text-sky-700 hover:underline font-bold cursor-pointer"
                        >
                          Ajustar stock
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsProductModalOpen(true);
                          }}
                          className="text-slate-700 hover:underline font-semibold cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Agregar / Editar Producto */}
      <EstadoInventarioModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onCreated={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
          triggerReload();
        }}
      />

      {/* Modal para Ajustar Existencia (+ / - / =) */}
      <EditarExistenciaModal
        isOpen={stockProduct !== null}
        product={stockProduct}
        onClose={() => setStockProduct(null)}
        onSave={async (newStock) => {
          if (!stockProduct) return false;
          await ajustarStock(stockProduct.id, newStock);
          triggerReload();
          return true;
        }}
      />
    </div>
  );
};