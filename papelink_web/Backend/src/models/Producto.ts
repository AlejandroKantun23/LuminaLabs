// ============================================================================
// MODELO DE PRODUCTO: Un artículo del inventario con su precio y existencias.
// ============================================================================
export class Producto {
    id: number;
    categoria_id?: number;
    categoria?: string;          // Nombre de la categoría (viene del JOIN)
    sku: string | null;          // Código interno (CUA-100R)
    codigo_barras: string | null;
    nombre: string;
    descripcion: string | null;
    precio: number;
    stock: number;
    stock_minimo?: number;       // Solo lo ve el personal (para "Stock bajo")
    estatus?: string;            // Disponible / Stock bajo / Sin existencias (vista v_inventario)
    imagen_url: string | null;
    activo?: number;

    constructor(fila: any) {
        this.id = fila.id;
        this.categoria_id = fila.categoria_id;
        this.categoria = fila.categoria;
        this.sku = fila.sku ?? null;
        this.codigo_barras = fila.codigo_barras ?? null;
        this.nombre = fila.nombre;
        this.descripcion = fila.descripcion ?? null;
        this.precio = fila.precio;
        this.stock = fila.stock;
        this.stock_minimo = fila.stock_minimo;
        this.estatus = fila.estatus;
        this.imagen_url = fila.imagen_url ?? null;
        this.activo = fila.activo;
    }
}
