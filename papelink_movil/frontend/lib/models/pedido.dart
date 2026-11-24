// Un renglón del pedido: qué producto, cuántos y a qué precio
class PedidoItem {
  const PedidoItem({
    required this.productoId,
    required this.nombre,
    required this.cantidad,
    required this.precioUnitario,
    required this.subtotal,
  });

  final int productoId;
  final String nombre;
  final int cantidad;
  final double precioUnitario;
  final double subtotal;

  factory PedidoItem.fromJson(Map<String, dynamic> json) => PedidoItem(
        productoId: _aInt(json['producto_id']),
        nombre: (json['nombre'] ?? '').toString(),
        cantidad: _aInt(json['cantidad']),
        precioUnitario: _aDouble(json['precio_unitario']),
        subtotal: _aDouble(json['subtotal']),
      );
}

// Un apartado hecho desde la app (tabla pedidos de la base de datos)
class Pedido {
  const Pedido({
    required this.id,
    required this.folio,
    required this.estado,
    required this.total,
    required this.articulos,
    this.resumen,
    this.fechaCreacion,
    this.fechaLimite,
    this.items = const [],
  });

  final int id;
  final String folio; // P-00125
  final String estado; // pendiente, confirmado_apartado, listo_en_tienda, completado, cancelado
  final double total;
  final int articulos;
  final String? resumen; // "2 Cuaderno profesional, 1 Lápiz de grafito HB"
  final DateTime? fechaCreacion;
  final DateTime? fechaLimite; // hasta cuándo se guarda el apartado
  final List<PedidoItem> items; // solo viene cuando se pide el detalle

  factory Pedido.fromJson(Map<String, dynamic> json) {
    final detalle = json['detalle'];
    return Pedido(
      id: _aInt(json['id']),
      folio: (json['folio'] ?? '').toString(),
      estado: (json['estado'] ?? 'pendiente').toString(),
      total: _aDouble(json['total']),
      articulos: _aInt(json['articulos_count']),
      resumen: json['articulos_resumen']?.toString(),
      fechaCreacion: _aFecha(json['fecha_creacion']),
      fechaLimite: _aFecha(json['fecha_limite_recogida']),
      items: detalle is List
          ? detalle
              .whereType<Map<String, dynamic>>()
              .map(PedidoItem.fromJson)
              .toList()
          : const [],
    );
  }

  // Sigue en proceso (no ha sido entregado ni cancelado)
  bool get activo =>
      estado == 'pendiente' ||
      estado == 'confirmado_apartado' ||
      estado == 'listo_en_tienda';

  // El cliente solo puede cancelar mientras la tienda no lo deje listo
  bool get puedeCancelar =>
      estado == 'pendiente' || estado == 'confirmado_apartado';

  String get etiquetaEstado {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmado_apartado':
        return 'Confirmado';
      case 'listo_en_tienda':
        return 'Listo para recoger';
      case 'completado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  }

  // Paso de la línea de progreso: 0 recibido, 1 confirmado, 2 listo, 3 entregado, -1 cancelado
  int get paso {
    switch (estado) {
      case 'pendiente':
        return 0;
      case 'confirmado_apartado':
        return 1;
      case 'listo_en_tienda':
        return 2;
      case 'completado':
        return 3;
      default:
        return -1;
    }
  }
}

// El servidor puede mandar los números como int, double o texto
int _aInt(dynamic valor) =>
    valor is int ? valor : (valor is num ? valor.toInt() : int.tryParse('$valor') ?? 0);

double _aDouble(dynamic valor) =>
    valor is num ? valor.toDouble() : double.tryParse('$valor') ?? 0;

DateTime? _aFecha(dynamic valor) =>
    valor == null ? null : DateTime.tryParse(valor.toString())?.toLocal();
