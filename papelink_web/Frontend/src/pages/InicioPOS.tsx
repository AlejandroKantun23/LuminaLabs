import React, { useEffect, useState } from "react";
import {
  getCatalogo,
  getInventario,
  getResumenDia,
  getVentas,
} from "../api/client";
import type { ProductoApi, ResumenDia, VentaApi } from "../api/client";

interface Product {
  productId: number;
  id: string;
  name: string;
  category: string;
  details: string;
  price: number;
}

export interface CartItem extends Product {
  qty: number;
}

interface Props {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOpenCobro: () => void;
  refreshKey: number;
}

export const InicioPOS: React.FC<Props> = ({
  cart,
  setCart,
  onOpenCobro,
  refreshKey,
}) => {
  const [today] = useState(() => new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [filteredCatalog, setFilteredCatalog] = useState<Product[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [summary, setSummary] = useState<ResumenDia | null>(null);
  const [recentSales, setRecentSales] = useState<VentaApi[]>([]);
  const [inventoryResult, setInventoryResult] = useState<{
    refreshKey: number;
    products: ProductoApi[];
    error: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const query = searchTerm.trim();
    if (!query) {
      return () => {
        active = false;
      };
    }

    const timer = window.setTimeout(() => {
      getCatalogo(query)
        .then((products) => {
          if (active) {
            setFilteredCatalog(
              products.map((product: ProductoApi) => ({
                productId: product.id,
                id: product.sku ?? product.codigo_barras ?? String(product.id),
                name: product.nombre,
                category: product.categoria,
                details: product.descripcion ?? "",
                price: product.precio,
              })),
            );
            setError("");
          }
        })
        .catch((requestError: unknown) => {
          if (active)
            setError(
              requestError instanceof Error
                ? requestError.message
                : "No se pudo buscar el producto.",
            );
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    let active = true;
    Promise.all([getResumenDia(), getVentas()])
      .then(([dailySummary, sales]) => {
        if (active) {
          setSummary(dailySummary);
          setRecentSales(sales.slice(0, 3));
        }
      })
      .catch((requestError: unknown) => {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el resumen.",
          );
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    let active = true;
    getInventario()
      .then((products) => {
        if (active) {
          setInventoryResult({ refreshKey, products, error: false });
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setInventoryResult({ refreshKey, products: [], error: true });
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar el inventario.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleAddProduct = (product: Product) => {
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.productId,
    );
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += Number(quantity) || 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, qty: Number(quantity) || 1 }]);
    }
    setSearchTerm("");
    setFilteredCatalog([]);
    setShowOptions(false);
    setQuantity(1);
  };

  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  const inventoryForCurrentRefresh =
    inventoryResult?.refreshKey === refreshKey ? inventoryResult : null;
  const inventoryLoaded =
    inventoryForCurrentRefresh !== null && !inventoryForCurrentRefresh.error;
  const inventoryError = inventoryForCurrentRefresh?.error === true;
  const inventory = inventoryLoaded ? inventoryForCurrentRefresh.products : [];
  const totalUnits = inventory.reduce((sum, product) => sum + product.stock, 0);
  const lowStock = inventory.filter(
    (product) =>
      product.estatus === "Stock bajo" || product.estatus === "Sin existencias",
  ).length;
  const lowStockCount = inventory.filter(
    (product) => product.estatus === "Stock bajo",
  ).length;
  const outOfStockCount = inventory.filter(
    (product) => product.estatus === "Sin existencias",
  ).length;
  const formatTicket = (sale: VentaApi) =>
    sale.ticket ?? `T-${String(sale.id).padStart(6, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inicio</h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">
            {today.toLocaleDateString("es-MX")}
          </p>
        </div>
        <button
          onClick={onOpenCobro}
          disabled={cart.length === 0}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition text-center cursor-pointer"
        >
          + Registrar venta
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Ventas de hoy
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            ${(summary?.ventas_hoy ?? 0).toFixed(2)}
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            MXN
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Unidades disponibles
          </span>
          <span className="text-2xl font-extrabold text-slate-900">
            {inventoryError ? "—" : inventoryLoaded ? totalUnits : "..."}
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            {inventoryError
              ? "No se pudo cargar el inventario"
              : "Existencias totales en inventario"}
          </span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">
            Existencias bajas
          </span>
          <span className="text-2xl font-extrabold text-amber-600">
            {inventoryError ? "—" : inventoryLoaded ? lowStock : "..."}
          </span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            {inventoryError
              ? "No se pudo cargar el inventario"
              : `${lowStockCount} con stock bajo · ${outOfStockCount} sin existencias`}
          </span>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Productos</h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 relative">
            <div className="sm:col-span-8 relative">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Buscar producto
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
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    if (!value.trim()) {
                      setFilteredCatalog([]);
                      setShowOptions(false);
                    } else {
                      setShowOptions(true);
                    }
                  }}
                  onFocus={() => {
                    if (searchTerm.trim()) {
                      setShowOptions(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setShowOptions(false);
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder="Nombre o modelo (ej. Cuaderno)"
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              {/* CAMBIO 4: Se condiciona también con showOptions */}
              {showOptions && filteredCatalog.length > 0 && (
                <div className="absolute left-0 right-0 top-16 bg-white border border-sky-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-sky-50">
                  {filteredCatalog.map((prod) => (
                    <div
                      key={prod.productId}
                      onClick={() => handleAddProduct(prod)}
                      className="p-3 hover:bg-sky-50 cursor-pointer flex justify-between items-center transition"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {prod.category} ·{" "}
                          <span className="text-sky-700 font-semibold">
                            {prod.id}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-sky-700">
                        ${prod.price.toFixed(2)} + Agregar
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                  <th className="pb-3">Producto</th>
                  <th className="pb-3 font-mono">Modelo</th>
                  <th className="pb-3 text-center">Cant.</th>
                  <th className="pb-3">Subtotal</th>
                  <th className="pb-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      El carrito está vacío. Utiliza el buscador para agregar
                      productos.
                    </td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr
                      key={item.id}
                      className="text-slate-800 hover:bg-sky-50/50"
                    >
                      <td className="py-3.5 pr-2 font-bold">{item.name}</td>
                      <td className="py-3.5 font-mono text-sky-700">
                        {item.id}
                      </td>
                      <td className="py-3.5 text-center font-bold">
                        {item.qty}
                      </td>
                      <td className="py-3.5 font-semibold">
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-xs text-rose-600 hover:underline cursor-pointer font-semibold"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="lg:col-span-4 bg-gradient-to-b from-white to-sky-50/60 border border-sky-100 rounded-2xl shadow-xs p-6 flex flex-col justify-between">
          <h3 className="font-bold text-sm text-slate-900 mb-4">
            Últimas ventas
          </h3>
          <div className="space-y-3 text-xs">
            {recentSales.length === 0 ? (
              <p className="py-2 text-slate-500">
                Aún no hay ventas registradas.
              </p>
            ) : (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex justify-between items-center py-2 border-b border-sky-100"
                >
                  <span>Venta #{formatTicket(sale)}</span>
                  <span className="font-bold text-sky-700">
                    ${sale.total.toFixed(2)}
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
