import React, { useEffect, useState } from "react";
import {
  actualizarProducto,
  crearProducto,
  getCategorias,
} from "../../api/client";
import type { Categoria, ProductoApi } from "../../api/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  product?: ProductoApi | null;
}

export const EstadoInventarioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreated,
  product = null,
}) => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    getCategorias()
      .then((result) => {
        setCategories(result);
        const selectedCategory =
          product?.categoria_id ??
          result.find((category) => category.nombre === product?.categoria)
            ?.id ??
          result[0]?.id;
        setCategoryId(selectedCategory ? String(selectedCategory) : "");
        setError("");
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudieron cargar las categorías.",
        );
      });

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, product, onClose]);

  if (!isOpen) return null;

  const isEditing = Boolean(product);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? "Editar producto" : "Registrar producto"}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-hidden border border-sky-100 flex flex-col"
      >
        {/* Cabecera azul estilo Papelink POS */}
        <div className="bg-sky-700 text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-200 block leading-tight">
                Inventario · Papelink POS
              </span>
              <h2 className="text-base font-extrabold leading-tight mt-0.5">
                {isEditing ? "Editar producto" : "Registrar nuevo producto"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="w-8 h-8 rounded-lg bg-sky-800/70 hover:bg-sky-900 border border-sky-500/40 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del formulario */}
        <form
          key={product?.id ?? "new-product"}
          className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setIsSubmitting(true);
            const form = new FormData(e.currentTarget);
            try {
              const code = String(form.get("sku") ?? "").trim();
              const descripcion = String(form.get("descripcion") ?? "").trim();
              const values = {
                ...(product?.sku
                  ? { sku: code }
                  : product?.codigo_barras
                    ? { codigo_barras: code }
                    : { sku: code || undefined }),
                nombre: String(form.get("nombre") ?? "").trim(),
                ...(descripcion ? { descripcion } : {}),
                precio: Number(form.get("precio")),
                categoria_id: Number(categoryId),
                stock: Number(form.get("stock")),
                stock_minimo: Number(form.get("minimo")),
              };
              if (product) {
                await actualizarProducto(product.id, values);
              } else {
                await crearProducto(values);
              }
              onCreated();
            } catch (requestError) {
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "No se pudo guardar el producto.",
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {/* Código y Nombre */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-5">
              <label
                htmlFor="inv-codigo"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                SKU / Código de barras
              </label>
              <input
                id="inv-codigo"
                name="sku"
                type="text"
                placeholder="Ej: CUA-100R"
                defaultValue={product?.sku ?? product?.codigo_barras ?? ""}
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-sky-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition"
              />
            </div>

            <div className="sm:col-span-7">
              <label
                htmlFor="inv-nombre"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                Nombre del producto
              </label>
              <input
                id="inv-nombre"
                name="nombre"
                type="text"
                placeholder="Ej: Cuaderno profesional 100 hojas"
                defaultValue={product?.nombre ?? ""}
                required
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition"
              />
            </div>
          </div>

          {/* Descripción opcional */}
          <div>
            <label
              htmlFor="inv-desc"
              className="block text-[11px] font-bold text-slate-700 mb-1"
            >
              Descripción{" "}
              <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <input
              id="inv-desc"
              name="descripcion"
              type="text"
              placeholder="Ej: Raya, 100 hojas, pasta dura"
              defaultValue={product?.descripcion ?? ""}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition"
            />
          </div>

          {/* Precio y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="inv-precio"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                Precio de venta (MXN)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sky-700 font-extrabold text-xs">
                  $
                </span>
                <input
                  id="inv-precio"
                  name="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue={product?.precio ?? ""}
                  required
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-7 pr-3 py-2.5 text-xs font-extrabold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="inv-cat"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                Categoría
              </label>
              <select
                id="inv-cat"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-600 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bloque de control de existencias */}
          <div className="bg-slate-50 border border-sky-100 rounded-xl p-3.5 space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 block">
              Control de existencias
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="inv-stock"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  {isEditing ? "Existencia actual" : "Stock inicial"}
                </label>
                <input
                  id="inv-stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="10"
                  defaultValue={product?.stock ?? 0}
                  required
                  className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="inv-min"
                  className="block text-[11px] font-bold text-slate-700 mb-1"
                >
                  Stock mínimo (alerta)
                </label>
                <input
                  id="inv-min"
                  name="minimo"
                  type="number"
                  min="0"
                  placeholder="5"
                  defaultValue={product?.stock_minimo ?? 5}
                  required
                  className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs font-extrabold text-amber-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            >
              {error}
            </div>
          )}

          {/* Pie de acciones */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar (ESC)
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !categories.length}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold rounded-xl shadow-xs transition cursor-pointer"
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "+ Guardar en inventario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};