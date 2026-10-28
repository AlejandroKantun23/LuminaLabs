{/* Filtros adaptables */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <div>
    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar producto</label>
    {/* Input */}
  </div>
  <div>
    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Categoría</label>
    {/* Select */}
  </div>
  <div>
    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estado de stock</label>
    {/* Select */}
  </div>
</div>

{/* Contenedor de tabla con scroll horizontal para evitar desbordamientos */}
<div className="overflow-x-auto mt-4">
  <table className="w-full text-left text-xs border-collapse min-w-[650px]">
    {/* Datos de inventario */}
  </table>
</div>