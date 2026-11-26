import React, { useEffect, useRef, useState } from "react";
import {
  buscarCodigo,
  getCatalogo,
  getInventario,
  getResumenDia,
} from "../api/client";
import type { ProductoApi, ResumenDia } from "../api/client";

interface Product {
  productId: number;
  id: string;
  name: string;
  category: string;
  details: string;
  price: number;
  stock?: number;
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

interface TicketSlot {
  id: number;
  name: string;
  items: CartItem[];
}

export const InicioPOS: React.FC<Props> = ({
  cart,
  setCart,
  onOpenCobro,
  refreshKey,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Múltiples tickets simultáneos estilo Eleventa
  const [tickets, setTickets] = useState<TicketSlot[]>([
    { id: 1, name: "Ticket 1", items: cart },
  ]);
  const [activeTicketId, setActiveTicketId] = useState<number>(1);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // Buscador y escáner
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [filteredCatalog, setFilteredCatalog] = useState<Product[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // Datos del día e inventario
  const [summary, setSummary] = useState<ResumenDia | null>(null);
  const [stockById, setStockById] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Sincronizar cuando App.tsx vacía el carrito tras cobrar
  useEffect(() => {
    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicketId ? { ...t, items: cart } : t)),
    );
  }, [cart, activeTicketId]);

  // Cargar resumen del día y mapa de existencias
  useEffect(() => {
    let active = true;
    Promise.all([getResumenDia(), getInventario()])
      .then(([dailySummary, products]) => {
        if (!active) return;
        setSummary(dailySummary);
        const map: Record<number, number> = {};
        products.forEach((p: ProductoApi) => {
          map[p.id] = Number(p.stock ?? 0);
        });
        setStockById(map);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar la información del día.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Búsqueda predictiva en catálogo
  useEffect(() => {
    let active = true;
    const raw = searchTerm.trim();
    const query = raw.includes("*") ? raw.split("*").slice(1).join("*").trim() : raw;
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
                price: Number(product.precio || 0),
                stock: Number(product.stock ?? 0),
              })),
            );
            setError("");
          }
        })
        .catch(() => {
          if (active) setFilteredCatalog([]);
        });
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchTerm]);

  // Atajos de teclado F10 (Buscar), F12 (Cobrar) y Delete (Quitar fila)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F10") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === "F12") {
        e.preventDefault();
        if (cart.length > 0) onOpenCobro();
      } else if (e.key === "Delete" && selectedRowId !== null) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          handleRemove(selectedRowId);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, onOpenCobro, selectedRowId]);

  const showTempMessage = (msg: string) => {
    setStatusMsg(msg);
    window.setTimeout(() => setStatusMsg(""), 2500);
  };

  const handleAddProduct = (product: Product, customQty?: number) => {
    const qtyToAdd = Math.max(1, customQty ?? (Number(quantity) || 1));
    const available = stockById[product.productId] ?? product.stock ?? 9999;

    const existingIndex = cart.findIndex(
      (item) => item.productId === product.productId,
    );
    const currentInCart = existingIndex > -1 ? cart[existingIndex].qty : 0;

    if (available <= 0) {
      setError(`"${product.name}" no tiene existencias disponibles.`);
      return;
    }
    if (currentInCart + qtyToAdd > available) {
      setError(
        `Stock insuficiente para "${product.name}". Disponible: ${available}.`,
      );
      return;
    }

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        qty: updatedCart[existingIndex].qty + qtyToAdd,
      };
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, qty: qtyToAdd }]);
    }

    setSelectedRowId(product.productId);
    setSearchTerm("");
    setFilteredCatalog([]);
    setShowOptions(false);
    setQuantity(1);
    setError("");
    showTempMessage(`+ ${qtyToAdd} × ${product.name}`);
    inputRef.current?.focus();
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    const item = cart.find((c) => c.productId === productId);
    if (!item) return;
    const nextQty = item.qty + delta;
    if (nextQty <= 0) {
      handleRemove(productId);
      return;
    }
    const available = stockById[productId] ?? item.stock ?? 9999;
    if (nextQty > available) {
      setError(`Solo hay ${available} unidades disponibles de "${item.name}".`);
      return;
    }
    setError("");
    setCart(
      cart.map((c) =>
        c.productId === productId ? { ...c, qty: nextQty } : c,
      ),
    );
  };

  const handleRemove = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
    if (selectedRowId === productId) setSelectedRowId(null);
  };

  // Escaneo directo con Enter (soporta "3*CUA-100R" o código de barras/SKU exacto)
  const handleScanEnter = async () => {
    const raw = searchTerm.trim();
    setShowOptions(false);
    if (!raw) return;

    let qty = Number(quantity) || 1;
    let code = raw;
    if (raw.includes("*")) {
      const [qtyPart, ...rest] = raw.split("*");
      const parsed = parseInt(qtyPart, 10);
      if (!isNaN(parsed) && parsed > 0) qty = parsed;
      code = rest.join("*").trim();
    }

    if (!code) return;

    // 1. Intentar coincidencia exacta por código/SKU en el backend
    try {
      const found = await buscarCodigo(code);
      handleAddProduct(
        {
          productId: found.id,
          id: found.sku ?? found.codigo_barras ?? String(found.id),
          name: found.nombre,
          category: found.categoria,
          details: found.descripcion ?? "",
          price: Number(found.precio || 0),
          stock: Number(found.stock ?? 0),
        },
        qty,
      );
      return;
    } catch {
      // 2. Si no hubo código exacto pero hay 1 sola coincidencia en el filtro, agregarla
      if (filteredCatalog.length === 1) {
        handleAddProduct(filteredCatalog[0], qty);
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const handleSwitchTicket = (id: number) => {
    const target = tickets.find((t) => t.id === id);
    if (!target) return;
    setActiveTicketId(id);
    setCart(target.items);
    setSelectedRowId(null);
    inputRef.current?.focus();
  };

  const handleNewTicket = () => {
    const nextId = Math.max(...tickets.map((t) => t.id)) + 1;
    const newSlot: TicketSlot = {
      id: nextId,
      name: `Ticket ${nextId}`,
      items: [],
    };
    setTickets([...tickets, newSlot]);
    setActiveTicketId(nextId);
    setCart([]);
    setSelectedRowId(null);
    inputRef.current?.focus();
  };

  const handleCloseTicket = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tickets.length === 1) {
      setCart([]);
      return;
    }
    const remaining = tickets.filter((t) => t.id !== id);
    setTickets(remaining);
    if (activeTicketId === id) {
      setActiveTicketId(remaining[0].id);
      setCart(remaining[0].items);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalPieces = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Barra superior de escaneo estilo Eleventa */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-8 relative">
            <label
              htmlFor="pos-scanner-input"
              className="block text-[11px] font-bold text-slate-700 mb-1"
            >
              Código del Producto, SKU o Nombre{" "}
              <span className="font-normal text-slate-400">
              </span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sky-600 font-bold text-xs">
                ⌕
              </span>
              <input
                ref={inputRef}
                id="pos-scanner-input"
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  if (!val.trim()) {
                    setFilteredCatalog([]);
                    setShowOptions(false);
                  } else {
                    setShowOptions(true);
                  }
                }}
                onFocus={() => {
                  if (searchTerm.trim()) setShowOptions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleScanEnter();
                  } else if (e.key === "Escape") {
                    setShowOptions(false);
                  }
                }}
                placeholder="Escanea código de barras o escribe nombre (ej. Cuaderno)..."
                className="w-full bg-sky-50/40 border-2 border-sky-300 rounded-lg pl-8 pr-3 py-2 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>

            {showOptions && filteredCatalog.length > 0 && (
              <div className="absolute left-0 right-0 top-[66px] bg-white border border-sky-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-100">
                {filteredCatalog.map((prod) => {
                  const stock = stockById[prod.productId] ?? prod.stock ?? 0;
                  return (
                    <div
                      key={prod.productId}
                      onClick={() => handleAddProduct(prod)}
                      className="px-3.5 py-2.5 hover:bg-sky-50 cursor-pointer flex justify-between items-center transition"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {prod.category} ·{" "}
                          <span className="font-mono text-sky-700 font-semibold">
                            {prod.id}
                          </span>{" "}
                          ·{" "}
                          <span
                            className={
                              stock <= 0
                                ? "text-rose-600 font-bold"
                                : "text-emerald-700 font-semibold"
                            }
                          >
                            Stock: {stock}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-sky-700">
                        ${prod.price.toFixed(2)} + Agregar
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="pos-qty-input"
              className="block text-[11px] font-bold text-slate-700 mb-1"
            >
              Cantidad
            </label>
            <input
              id="pos-qty-input"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-full bg-white border-2 border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-center text-slate-800 focus:outline-none focus:border-sky-600"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => void handleScanEnter()}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow-xs transition cursor-pointer"
            >
              ↵ Agregar
            </button>
          </div>
        </div>

        {(error || statusMsg) && (
          <div className="mt-2.5 flex items-center justify-between text-xs">
            {error ? (
              <p role="alert" className="font-semibold text-rose-600">
                {error}
              </p>
            ) : (
              <p className="font-semibold text-emerald-700">{statusMsg}</p>
            )}
          </div>
        )}
      </div>

      {/* Pestañas de tickets múltiples + resumen rápido del día */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {tickets.map((t) => {
            const isCurrent = t.id === activeTicketId;
            const count = t.items.reduce((s, i) => s + i.qty, 0);
            return (
              <div
                key={t.id}
                onClick={() => handleSwitchTicket(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-bold border border-b-0 cursor-pointer transition select-none ${
                  isCurrent
                    ? "bg-white text-sky-700 border-slate-200"
                    : "bg-slate-200/70 text-slate-600 border-transparent hover:bg-slate-200"
                }`}
              >
                <span>{t.name}</span>
                {count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 text-[10px]">
                    {count}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => handleCloseTicket(t.id, e)}
                  title="Limpiar o cerrar ticket"
                  className="text-slate-400 hover:text-rose-600 text-[11px] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={handleNewTicket}
            className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 cursor-pointer"
          >
            + Nuevo Ticket
          </button>
        </div>

        <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-3">
          <span>
            Ventas hoy:{" "}
            <strong className="text-slate-900">
              ${Number(summary?.ventas_hoy ?? 0).toFixed(2)}
            </strong>
          </span>
        </div>
      </div>

      {/* Tabla principal de venta tipo Eleventa */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[290px]">
          <table className="w-full text-left text-xs border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-sky-700 text-white font-bold text-[11px] uppercase tracking-wide">
                <th className="py-2.5 px-3 w-28">Código</th>
                <th className="py-2.5 px-3">Descripción del Producto</th>
                <th className="py-2.5 px-3 text-right w-28">Precio Venta</th>
                <th className="py-2.5 px-3 text-center w-32">Cantidad</th>
                <th className="py-2.5 px-3 text-right w-28">Importe</th>
                <th className="py-2.5 px-3 text-center w-24">Existencia</th>
                <th className="py-2.5 px-3 text-right w-20">Quitar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cart.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-slate-400 text-sm"
                  >
                    Escanea un código de barras o busca un producto arriba para comenzar la venta.
                  </td>
                </tr>
              ) : (
                cart.map((item) => {
                  const isSelected = selectedRowId === item.productId;
                  const available = stockById[item.productId] ?? item.stock ?? 0;
                  return (
                    <tr
                      key={item.productId}
                      onClick={() => setSelectedRowId(item.productId)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? "bg-sky-100/70"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-sky-800">
                        {item.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.category}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQty(item.productId, -1);
                            }}
                            className="w-6 h-6 rounded border border-slate-300 bg-white hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-extrabold text-slate-900">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQty(item.productId, 1);
                            }}
                            className="w-6 h-6 rounded border border-slate-300 bg-white hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900 text-sm">
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {available}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.productId);
                          }}
                          className="text-rose-600 hover:underline font-bold cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Barra inferior de cobro estilo Eleventa */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => setCart([])}
              className="px-3.5 py-2.5 border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 disabled:opacity-40 rounded-lg text-xs font-bold cursor-pointer transition"
            >
              Cancelar Ticket
            </button>
            <div className="text-xs text-slate-600">
              Artículos en venta:{" "}
              <strong className="text-slate-900 text-sm">{totalPieces}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={onOpenCobro}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="px-1.5 py-0.5 rounded bg-emerald-800/70 font-mono text-[11px]">
                F12
              </span>
              <span>Cobrar</span>
            </button>

            <div className="bg-slate-900 text-emerald-400 px-5 py-2 rounded-xl text-right min-w-[165px] shadow-inner">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total a Pagar
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};