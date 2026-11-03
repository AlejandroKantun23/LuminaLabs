const BASE = import.meta.env.VITE_API_URL ?? "/api";

export type Metodo = "efectivo" | "tarjeta" | "transferencia";
export type Item = { producto_id: number; cantidad: number };

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  rol: "cliente" | "empleado" | "admin";
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface ProductoApi {
  id: number;
  sku: string | null;
  codigo_barras: string | null;
  nombre: string;
  descripcion: string | null;
  categoria_id?: number;
  categoria: string;
  precio: number;
  stock: number;
  stock_minimo?: number;
  estatus?: string;
  activo?: number;
  imagen_url: string | null;
}

export interface VentaApi {
  id: number;
  ticket: string;
  fecha_venta: string;
  total: number;
  metodo_pago: Metodo;
  atendio: string;
  articulos: number;
  pedido_id: number | null;
  detalle?: Array<{
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>;
}

export interface PedidoApi {
  id: number;
  usuario_id: number;
  folio: string;
  cliente: string;
  contacto: string | null;
  estado:
    | "pendiente"
    | "confirmado_apartado"
    | "listo_en_tienda"
    | "completado"
    | "cancelado";
  total: number;
  fecha_creacion: string;
  fecha_limite_recogida: string | null;
  articulos_count: number;
  articulos_resumen: string | null;
  detalle?: Array<{
    producto_id: number;
    nombre: string;
    imagen_url: string | null;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }>;
}

export interface ResumenDia {
  ventas_hoy: number;
  ventas_registradas: number;
  articulos_vendidos: number;
  ticket_promedio: number;
  pedidos_por_estado: Record<string, number>;
  pedidos_completados_hoy: number;
  inventario: {
    unidades: number;
    stock_bajo: number;
    sin_existencias: number;
  };
}

export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string | null) =>
  token ? localStorage.setItem("token", token) : localStorage.removeItem("token");

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = getToken();
  const hasBody = opts.body !== undefined;
  const response = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: hasBody ? JSON.stringify(opts.body) : undefined,
  });

  const text = await response.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new Error("El servidor devolvió una respuesta inválida");
    }
  }

  if (response.status === 401) setToken(null);
  if (!response.ok) {
    const message = data.message ?? data.error;
    throw new Error(
      typeof message === "string" ? message : `Error ${response.status}`,
    );
  }
  return data as T;
}

export const login = async (email: string, password: string) => {
  const response = await api<{ token: string; user: Usuario }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(response.token);
  return response.user;
};

export const getUsuarioActual = () => api<Usuario>("/auth/me");
export const getCategorias = () => api<Categoria[]>("/categorias");
export const getCatalogo = (q: string) =>
  api<ProductoApi[]>(`/productos?${new URLSearchParams({ q })}`);
export const getInventario = () => api<ProductoApi[]>("/productos/inventario");
export const crearProducto = (producto: {
  categoria_id: number;
  sku?: string;
  codigo_barras?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  stock_minimo: number;
}) => api<{ id: number }>("/productos", { method: "POST", body: producto });
export const actualizarProducto = (
  id: number,
  producto: Partial<{
    categoria_id: number;
    sku: string;
    codigo_barras: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    stock_minimo: number;
  }>,
) => api(`/productos/${id}`, { method: "PUT", body: producto });
export const buscarCodigo = (codigo: string) =>
  api<ProductoApi>(`/productos/codigo/${encodeURIComponent(codigo)}`);
export const ajustarStock = (id: number, stock: number) =>
  api(`/productos/${id}/stock`, { method: "PATCH", body: { stock } });

export const crearVenta = (items: Item[], metodo_pago: Metodo) =>
  api<{ venta: VentaApi }>("/ventas", {
    method: "POST",
    body: { items, metodo_pago },
  });
export const getVentas = (desde?: string, hasta?: string) => {
  const params = new URLSearchParams();
  if (desde) params.set("desde", desde);
  if (hasta) params.set("hasta", hasta);
  const query = params.toString();
  return api<VentaApi[]>(`/ventas${query ? `?${query}` : ""}`);
};
export const getVenta = (id: number) => api<VentaApi>(`/ventas/${id}`);

export const getPedidos = (estado?: string) =>
  api<PedidoApi[]>(`/pedidos${estado ? `?estado=${encodeURIComponent(estado)}` : ""}`);
export const getPedido = (id: number) => api<PedidoApi>(`/pedidos/${id}`);
export const cambiarEstadoPedido = (
  id: number,
  estado: PedidoApi["estado"],
) => api(`/pedidos/${id}/estado`, { method: "PATCH", body: { estado } });
export const cobrarPedido = (id: number, metodo_pago: Metodo) =>
  api<{ venta_id: number }>(`/pedidos/${id}/cobrar`, {
    method: "POST",
    body: { metodo_pago },
  });
export const getResumenDia = () => api<ResumenDia>("/reportes/resumen-dia");
