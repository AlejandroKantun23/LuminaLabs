import React, { useEffect, useMemo, useState } from 'react';
import { ajustarStock, getCategorias, getInventario } from '../api/client';
import type { Categoria, ProductoApi } from '../api/client';
import { EditarExistenciaModal } from '../components/modals/editarexistencia';

interface Props {
  onOpenAgregarProducto: () => void;
  onEditProducto: (product: ProductoApi) => void;
  refreshKey: number;
}

export const Inventario: React.FC<Props> = ({ onOpenAgregarProducto, onEditProducto, refreshKey }) => {
  const [products, setProducts] = useState<ProductoApi[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductoApi | null>(null);
  const [error, setError] = useState('');
  const [adjustMode, setAdjustMode] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getInventario(), getCategorias()])
      .then(([inventory, categoryList]) => {
        if (active) {
          setProducts(inventory);
          setCategories(categoryList);
          setError('');
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el inventario.');
      });
    return () => { active = false; };
  }, [refreshKey]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [
      product.nombre,
      product.sku ?? '',
      product.codigo_barras ?? '',
      product.categoria,
    ].some((value) => value.toLowerCase().includes(term));
    const categoryName = categories.find((item) => String(item.id) === category)?.nombre;
    const matchesCategory = !category || product.categoria === categoryName;
    const matchesStatus = !status || product.estatus === status;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [products, categories, search, category, status]);

  const lowStock = products.filter((product) =>
    product.estatus === 'Stock bajo' || product.estatus === 'Sin existencias',
  ).length;
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const openAdjustment = (product: ProductoApi | undefined) => {
    if (product) setSelectedProduct(product);
    else setError('No hay productos para ajustar.');
  };
  const saveStock = async (stock: number) => {
    if (!selectedProduct) return false;
    await ajustarStock(selectedProduct.id, stock);
    const inventory = await getInventario();
    setProducts(inventory);
    setAdjustMode(false);
    return true;
  };

  return (
    <div className="p-8 bg-[#EAF2F8] min-h-[calc(100vh-4rem)] select-none">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inventario</h1>
          <p className="text-xs text-sky-700 font-semibold mt-0.5">Consulta existencias y administra tus productos.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenAgregarProducto}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs px-4 py-2.5 rounded-xl font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Agregar producto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Productos en catálogo</span>
          <span className="text-2xl font-extrabold text-slate-900">{products.length}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">Modelos distintos registrados</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Unidades disponibles</span>
          <span className="text-2xl font-extrabold text-slate-900">{totalUnits}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">Existencias totales en inventario</span>
        </div>
        <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-200/70 p-5 rounded-2xl shadow-xs">
          <span className="text-[11px] text-sky-800 font-bold block mb-1">Existencias bajas</span>
          <span className="text-2xl font-extrabold text-amber-600">{lowStock}</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-1">
            {products.filter((product) => product.estatus === 'Stock bajo').length} con stock bajo · {products.filter((product) => product.estatus === 'Sin existencias').length} sin existencias
          </span>
        </div>
      </div>

      {error && <p role="alert" className="mb-4 text-xs font-medium text-red-600">{error}</p>}

      <div className="bg-white border border-sky-100 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900">Productos</h3>
          <span className="text-[11px] text-sky-700 font-semibold">Precios en MXN</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar producto</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sky-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre o modelo"
                className="w-full bg-sky-50/40 border border-sky-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Categoría</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white">
              <option value="">Todas las categorías</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estado de stock</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white">
              <option value="">Todos los estados</option>
              <option>Disponible</option>
              <option>Stock bajo</option>
              <option>Sin existencias</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-sky-800 font-semibold text-[11px]">
                <th className="pb-3">Producto</th>
                <th className="pb-3">Modelo</th>
                <th className="pb-3 text-center">Existencias</th>
                <th className="pb-3 text-center">Mínimo</th>
                <th className="pb-3">Precio (MXN)</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {filteredProducts.map((product) => {
                const productStatus = product.estatus ?? 'Disponible';
                return (
                  <tr key={product.id} className="text-slate-800 hover:bg-sky-50/50 transition">
                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-slate-900">{product.nombre}</div>
                      <div className="text-[10px] text-slate-500">{product.categoria} · {product.descripcion ?? ''}</div>
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-sky-700 font-semibold">{product.sku ?? product.codigo_barras ?? product.id}</td>
                    <td className="py-3.5 text-center font-bold text-slate-900">{product.stock}</td>
                    <td className="py-3.5 text-center text-slate-500">{product.stock_minimo ?? 0}</td>
                    <td className="py-3.5 font-semibold">${product.precio.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-block ${
                        productStatus === 'Sin existencias'
                          ? 'bg-slate-900 text-white'
                          : productStatus === 'Stock bajo'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {productStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          if (adjustMode) {
                            openAdjustment(product);
                          } else {
                            onEditProducto({
                              ...product,
                              categoria_id: categories.find((item) => item.nombre === product.categoria)?.id,
                            });
                          }
                        }}
                        className="text-xs text-sky-700 hover:underline font-semibold cursor-pointer"
                      >
                        {adjustMode ? 'Ajustar' : 'Editar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">No se encontraron productos.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-sky-100 flex justify-between items-center text-xs text-slate-500">
          <span>Mostrando {filteredProducts.length} de {products.length} productos</span>
          <div className="flex items-center gap-2">
            <span>Página 1 de 1</span>
            <div className="flex gap-1">
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&lt;</button>
              <button className="border border-sky-200 rounded-lg px-2.5 py-1 text-sky-700 hover:bg-sky-50 cursor-pointer">&gt;</button>
            </div>
          </div>
        </div>
      </div>
      <EditarExistenciaModal
        key={selectedProduct?.id}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct ? {
          id: selectedProduct.id,
          name: selectedProduct.nombre,
          stock: selectedProduct.stock,
        } : null}
        onSave={saveStock}
      />
    </div>
  );
};
