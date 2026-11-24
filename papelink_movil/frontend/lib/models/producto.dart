import 'package:flutter/material.dart';

class Producto {
  const Producto({
    required this.id,
    required this.nombre,
    required this.stock,
    required this.precio,
    this.unidad = 'c/u',
    this.icono = Icons.inventory_2_outlined,
    this.sku,
    this.categoriaId,
    this.descripcion,
    this.stockMinimo = 0,
    this.codigoBarras,
    this.imagenUrl,
    this.activo = true,
  });

  final String id;
  final String nombre;
  final int stock;
  final double precio;
  final String unidad;
  final IconData icono;
  final String? sku;
  final int? categoriaId;
  final String? descripcion;
  final int stockMinimo;
  final String? codigoBarras;
  final String? imagenUrl;
  final bool activo;

  bool get disponible => activo && stock > 0;
  bool get stockBajo =>
      disponible && (stockMinimo > 0 ? stock <= stockMinimo : stock <= 6);

  String get textoDisponibilidad =>
      disponible ? '$stock dispo.' : '¡Sin existencia!';

  static List<Producto> _productosRemotos = [];

  static List<Producto> get catalogo =>
      _productosRemotos.isNotEmpty ? _productosRemotos : _catalogoRespaldo;

  static void establecerCatalogo(List<Producto> productos) {
    _productosRemotos = List<Producto>.unmodifiable(productos);
  }

  static Producto? buscarPorId(String id) {
    for (final producto in _productosRemotos) {
      if (producto.id == id) return producto;
    }
    for (final producto in _catalogoRespaldo) {
      if (producto.id == id) return producto;
    }
    return null;
  }

  factory Producto.fromJson(Map<String, dynamic> json) {
    final nombre = (json['nombre'] ?? '').toString().trim();
    final stock = _parseInt(json['stock']);
    final precio = _parseDouble(json['precio']);
    final categoriaId = json['categoria_id'] == null
        ? null
        : _parseInt(json['categoria_id']);
    final activoRaw = json['activo'];
    final activo = activoRaw == null
        ? true
        : (activoRaw is bool ? activoRaw : _parseInt(activoRaw) != 0);

    return Producto(
      id: (json['id'] ?? '').toString(),
      nombre: nombre.isEmpty ? 'Producto sin nombre' : nombre,
      stock: stock < 0 ? 0 : stock,
      precio: precio < 0 ? 0 : precio,
      unidad: (json['unidad'] ?? 'c/u').toString(),
      icono: _iconoPorCategoria(categoriaId, nombre),
      sku: json['sku']?.toString(),
      categoriaId: categoriaId,
      descripcion: json['descripcion']?.toString(),
      stockMinimo: _parseInt(json['stock_minimo']),
      codigoBarras: json['codigo_barras']?.toString(),
      imagenUrl: json['imagen_url']?.toString(),
      activo: activo,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'nombre': nombre,
        'stock': stock,
        'precio': precio,
        'unidad': unidad,
        'sku': sku,
        'categoria_id': categoriaId,
        'descripcion': descripcion,
        'stock_minimo': stockMinimo,
        'codigo_barras': codigoBarras,
        'imagen_url': imagenUrl,
        'activo': activo ? 1 : 0,
      };

  static int _parseInt(dynamic value) {
    if (value is int) return value;
    if (value is num) return value.toInt();
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  static double _parseDouble(dynamic value) {
    if (value is double) return value;
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

// Mapa de categorías según la tabla `categorias` de MySQL
  static const categorias = <int, String>{
    1: 'Cuadernos',
    2: 'Escritura',
    3: 'Papel',
    4: 'Arte',
    5: 'Escolar',
  };

  static IconData _iconoPorCategoria(int? categoriaId, String nombre) {
    switch (categoriaId) {
      case 1: // Cuadernos
        return Icons.menu_book_outlined;
      case 2: // Escritura
        return Icons.edit_outlined;
      case 3: // Papel
        return Icons.description_outlined;
      case 4: // Arte
        return Icons.palette_outlined;
      case 5: // Escolar
        return Icons.content_cut_outlined;
      default:
        final lower = nombre.toLowerCase();
        if (lower.contains('cuaderno') || lower.contains('libreta')) {
          return Icons.menu_book_outlined;
        }
        if (lower.contains('lápiz') ||
            lower.contains('lapiz') ||
            lower.contains('pluma')) {
          return Icons.edit_outlined;
        }
        if (lower.contains('papel') ||
            lower.contains('hoja') ||
            lower.contains('cartulina')) {
          return Icons.description_outlined;
        }
        if (lower.contains('marcador') ||
            lower.contains('color') ||
            lower.contains('pintura')) {
          return Icons.palette_outlined;
        }
        if (lower.contains('tijera') || lower.contains('pegamento')) {
          return Icons.content_cut_outlined;
        }
        return Icons.inventory_2_outlined;
    }
  }

// Catálogo local de respaldo/prueba: se usa si aún no han cargado los
// productos desde la API o si el carrito busca un ID antes de consultar el servidor.
  static const _catalogoRespaldo = <Producto>[
    Producto(
      id: '1',
      nombre: 'Cuaderno profesional',
      categoriaId: 1,
      stock: 48,
      precio: 45,
      unidad: 'c/u',
      icono: Icons.menu_book_outlined,
    ),
    Producto(
      id: '2',
      nombre: 'Lápiz de grafito HB',
      categoriaId: 2,
      stock: 8,
      precio: 6,
      unidad: 'c/u',
      icono: Icons.edit_outlined,
    ),
    Producto(
      id: '3',
      nombre: 'Marcadores de colores',
      categoriaId: 4,
      stock: 0,
      precio: 68,
      unidad: 'c/u',
      icono: Icons.palette_outlined,
    ),
    Producto(
      id: '4',
      nombre: 'Tijeras escolares',
      categoriaId: 5,
      stock: 12,
      precio: 25,
      unidad: 'c/u',
      icono: Icons.content_cut_outlined,
    ),
  ];
}

class ItemCarrito {
  const ItemCarrito({required this.producto, required this.cantidad});

  final Producto producto;
  final int cantidad;

  double get total => producto.precio * cantidad;
}
