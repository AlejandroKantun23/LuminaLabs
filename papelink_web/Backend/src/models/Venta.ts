// ============================================================================
// MODELO DE VENTA: Un cobro hecho en el mostrador (POS). Se arma desde la
// vista v_ventas. Si salió de un apartado, trae pedido_id; si no, es directa.
// ============================================================================
export class Venta {
    id: number;
    ticket: string;                   // T-000123
    fecha_venta: Date;
    total: number;
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
    atendio: string;                   // Empleado que cobró
    articulos: number;
    articulos_resumen: string;         // NUEVO: "3 cuadernos, 2 tijeras"
    pedido_id: number | null;
    detalle?: DetalleVenta[];

    constructor(fila: any) {
        this.id = fila.id;
        this.ticket = fila.ticket;
        this.fecha_venta = fila.fecha_venta;
        this.total = fila.total;
        this.metodo_pago = fila.metodo_pago;
        this.atendio = fila.atendio;
        this.articulos = Number(fila.articulos ?? 0);
        this.articulos_resumen = fila.articulos_resumen ?? 'Sin artículos';
        this.pedido_id = fila.pedido_id ?? null;
    }
}

export class DetalleVenta {
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;

    constructor(fila: any) {
        this.producto_id = fila.producto_id;
        this.nombre = fila.nombre;
        this.cantidad = fila.cantidad;
        this.precio_unitario = fila.precio_unitario;
        this.subtotal = fila.subtotal;
    }
}