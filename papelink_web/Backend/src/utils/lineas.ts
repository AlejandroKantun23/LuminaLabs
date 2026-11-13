import { PoolConnection } from 'mysql2/promise';
import { ErrorHttp } from './errores';

// LÍNEAS DE UN PEDIDO O VENTA: El cliente solo manda { producto_id, cantidad }.
// El PRECIO se lee siempre de la base de datos (nunca del cliente), y el total
// se calcula aquí, para que nadie pueda alterar un precio desde la app.
export interface Linea { producto_id: number; cantidad: number; precio_unitario: number; }

export async function cargarLineas(conn: PoolConnection, items: any): Promise<{ lineas: Linea[]; total: number }> {
    if (!Array.isArray(items) || items.length === 0) throw new ErrorHttp(400, 'Se requiere al menos un artículo');

    // Valida cada artículo y junta los repetidos
    const cantidades = new Map<number, number>();
    for (const it of items) {
        const id = Number(it?.producto_id);
        const cantidad = Number(it?.cantidad);
        if (!Number.isInteger(id) || !Number.isInteger(cantidad) || cantidad < 1)
            throw new ErrorHttp(400, 'Artículo inválido: producto_id y cantidad (entero mayor a 0) son obligatorios');
        cantidades.set(id, (cantidades.get(id) || 0) + cantidad);
    }

    const [rows]: any = await conn.query(
        'SELECT id, precio FROM productos WHERE activo = 1 AND id IN (?)', [[...cantidades.keys()]]
    );
    const precios = new Map<number, number>(rows.map((r: any) => [r.id, r.precio]));

    const lineas: Linea[] = [];
    for (const [producto_id, cantidad] of cantidades) {
        const precio = precios.get(producto_id);
        if (precio === undefined) throw new ErrorHttp(400, `El producto ${producto_id} no existe o no está disponible`);
        lineas.push({ producto_id, cantidad, precio_unitario: precio });
    }
    const total = Math.round(lineas.reduce((s, l) => s + l.precio_unitario * l.cantidad, 0) * 100) / 100;
    return { lineas, total };
}
