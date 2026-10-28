{/* Grid Principal Adaptable */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  
  {/* Sección de Productos / Carrito (Ocupa 8 columnas en desktop, 1 en móvil) */}
  <div className="lg:col-span-8 bg-white border border-sky-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
    
    {/* Buscador y Cantidad responsivos */}
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
      <div className="sm:col-span-8 relative">
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar producto</label>
        {/* Input de búsqueda */}
      </div>
      <div className="sm:col-span-4">
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cantidad</label>
        {/* Input de cantidad */}
      </div>
    </div>

    {/* Tabla con scroll horizontal automático en pantallas pequeñas */}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse min-w-[550px]">
        {/* Filas de la tabla */}
      </table>
    </div>
  </div>

  {/* Panel lateral de Últimas Ventas (Ocupa 4 columnas en desktop) */}
  <div className="lg:col-span-4 bg-gradient-to-b from-white to-sky-50/60 border border-sky-100 rounded-2xl shadow-xs p-6 flex flex-col justify-between">
    {/* Contenido de últimas ventas */}
  </div>

</div>