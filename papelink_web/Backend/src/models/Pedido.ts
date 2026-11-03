// ============================================================================
// MODELO DE PEDIDO (APARTADO): Lo que el cliente aparta desde la app para
// recogerlo y pagarlo en tienda. Se arma desde la vista v_pedidos.
// ============================================================================
export type EstadoPedido = 'pendiente' | 'confirmado_apartado' | 'listo_en_tienda' | 'completado' | 'cancelado';

export class Pedido {
    id: number;
    usuario_id: number;
    folio: string;                    // P-00125
    cliente: string;
    contacto: string | null;
    estado: EstadoPedido;
    total: number;
    fecha_creacion: Date;
    fecha_limite_recogida: Date | null;
    articulos_count: number;
    articulos_resumen: string | null;
    detalle?: DetallePedido[];        // Solo cuando se pide un pedido en específico

    constructor(fila: any) {
        this.id = fila.id;
        this.usuario_id = fila.usuario_id;
        this.folio = fila.folio;
        this.cliente = fila.cliente;
        this.contacto = fila.contacto ?? null;
        this.estado = fila.estado;
        this.total = fila.total;
        this.fecha_creacion = fila.fecha_creacion;
        this.fecha_limite_recogida = fila.fecha_limite_recogida ?? null;
        this.articulos_count = Number(fila.articulos_count ?? 0);
        this.articulos_resumen = fila.articulos_resumen ?? null;
    }
}

// Cada renglón del pedido: qué producto, cuántos y a qué precio
export class DetallePedido {
    producto_id: number;
    nombre: string;
    imagen_url: string | null;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;

    constructor(fila: any) {
        this.producto_id = fila.producto_id;
        this.nombre = fila.nombre;
        this.imagen_url = fila.imagen_url ?? null;
        this.cantidad = fila.cantidad;
        this.precio_unitario = fila.precio_unitario;
        this.subtotal = fila.subtotal;
    }
}
