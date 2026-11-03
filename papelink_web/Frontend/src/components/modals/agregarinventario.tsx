import React, { useEffect, useState } from "react";
import { actualizarProducto, crearProducto, getCategorias } from "../../api/client";
import type { Categoria, ProductoApi } from "../../api/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  product?: ProductoApi | null;
}

export const EstadoInventarioModal: React.FC<Props> = ({ isOpen, onClose, onCreated, product = null }) => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    getCategorias()
      .then((result) => {
        setCategories(result);
        const selectedCategory = product?.categoria_id
          ?? result.find((category) => category.nombre === product?.categoria)?.id
          ?? result[0]?.id;
        setCategoryId(selectedCategory ? String(selectedCategory) : "");
        setError("");
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar las categorías.");
      });
  }, [isOpen, product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Registrar producto"
        className="bg-white rounded-lg shadow-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative border border-gray-200"
      >
        <div className="text-center font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider border-b pb-2">
          Estado del inventario - Registrar Producto
        </div>

        <form
          className="space-y-3 text-xs"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setIsSubmitting(true);
            const form = new FormData(e.currentTarget);
            try {
            const code = String(form.get("sku") ?? "").trim();
            const values = {
              ...(product?.sku
                ? { sku: code }
                : product?.codigo_barras
                ? { codigo_barras: code }
                : { sku: code || undefined }),
              nombre: String(form.get("nombre") ?? "").trim(),
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
              setError(requestError instanceof Error ? requestError.message : "No se pudo guardar el producto.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div>
            <label htmlFor="inv-codigo" className="block text-gray-600 mb-1">
              Código de Barras / ID
            </label>
            <input
              id="inv-codigo"
              name="sku"
              type="text"
              placeholder="Ej: 750123456789"
              defaultValue={product?.sku ?? product?.codigo_barras ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div>
            <label htmlFor="inv-nombre" className="block text-gray-600 mb-1">
              Nombre del Producto
            </label>
            <input
              id="inv-nombre"
              name="nombre"
              type="text"
              placeholder="Ej: Cuaderno Profesional 100 hojas"
              defaultValue={product?.nombre ?? ""}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="inv-precio" className="block text-gray-600 mb-1">
                Precio de Venta ($)
              </label>
              <input
                id="inv-precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                defaultValue={product?.precio ?? ""}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label htmlFor="inv-cat" className="block text-gray-600 mb-1">
                Categoría
              </label>
              <select
                id="inv-cat"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="inv-stock" className="block text-gray-600 mb-1">
                Stock Inicial
              </label>
              <input
                id="inv-stock"
                name="stock"
                type="number"
                min="0"
                placeholder="10"
                defaultValue={product?.stock ?? 0}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div>
              <label htmlFor="inv-min" className="block text-gray-600 mb-1">
                Stock Mínimo (Alerta)
              </label>
              <input
                id="inv-min"
                name="minimo"
                type="number"
                min="0"
                placeholder="5"
                defaultValue={product?.stock_minimo ?? 5}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          {error && <p role="alert" className="text-red-600">{error}</p>}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !categories.length}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              {isSubmitting ? "Guardando..." : product ? "Guardar cambios" : "Guardar en Inventario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};