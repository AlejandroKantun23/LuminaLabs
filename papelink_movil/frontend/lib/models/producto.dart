import 'package:flutter/material.dart';

class Producto {
  const Producto({
    required this.id,
    required this.nombre,
    required this.stock,
    required this.precio,
    required this.unidad,
    required this.icono,
  });

  final String id;
  final String nombre;
  final int stock;
  final double precio;
  final String unidad;
  final IconData icono;

  bool get disponible => stock > 0;
  bool get stockBajo => disponible && stock <= 6;

  String get textoDisponibilidad =>
      disponible ? '$stock dispo.' : '¡Sin existencia!';

  static const catalogo = <Producto>[
    Producto(
      id: 'lapiz-grafito-hb',
      nombre: 'Lápiz Grafito HB',
      stock: 15,
      precio: 10,
      unidad: 'c/u',
      icono: Icons.edit,
    ),
    Producto(
      id: 'borrador-blanco',
      nombre: 'Borrador Blanco',
      stock: 19,
      precio: 7,
      unidad: 'c/u',
      icono: Icons.layers_clear,
    ),
    Producto(
      id: 'libreta-raya-100h',
      nombre: 'Libreta Raya 100h',
      stock: 6,
      precio: 25,
      unidad: 'c/u',
      icono: Icons.article_outlined,
    ),
    Producto(
      id: 'papel-bond-500h',
      nombre: 'Paq. Papel Bond 500h',
      stock: 0,
      precio: 159.99,
      unidad: '',
      icono: Icons.view_in_ar,
    ),
  ];

  static Producto? buscarPorId(String id) {
    for (final producto in catalogo) {
      if (producto.id == id) return producto;
    }
    return null;
  }
}

class ItemCarrito {
  const ItemCarrito({required this.producto, required this.cantidad});

  final Producto producto;
  final int cantidad;

  double get total => producto.precio * cantidad;
}
