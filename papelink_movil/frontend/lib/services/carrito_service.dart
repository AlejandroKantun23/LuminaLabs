import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/producto.dart';

class CarritoService extends ChangeNotifier {
  CarritoService._();

  static final CarritoService instance = CarritoService._();
  static const _storageKey = 'carrito_productos_v1';

  Map<String, int> _cantidades = {};
  SharedPreferences? _preferences;
  Future<void> _pendingSave = Future<void>.value();

  Future<void> cargar() async {
    if (_preferences != null) return;

    final preferences = await SharedPreferences.getInstance();
    final storedCart = preferences.getString(_storageKey);
    final quantities = <String, int>{};

    if (storedCart != null) {
      final decoded = jsonDecode(storedCart);
      if (decoded is! Map<String, dynamic>) {
        throw const FormatException(
          'El carrito local tiene un formato inválido.',
        );
      }

      for (final entry in decoded.entries) {
        final product = Producto.buscarPorId(entry.key);
        final quantity = entry.value;
        if (product != null &&
            product.stock > 0 &&
            quantity is int &&
            quantity > 0) {
          quantities[entry.key] = quantity > product.stock
              ? product.stock
              : quantity;
        }
      }
    }

    _preferences = preferences;
    _cantidades = quantities;
  }

  List<ItemCarrito> get items => [
    for (final product in Producto.catalogo)
      if ((_cantidades[product.id] ?? 0) > 0)
        ItemCarrito(producto: product, cantidad: _cantidades[product.id]!),
  ];

  int get totalArticulos => _cantidades.length;
  int get totalPiezas =>
      _cantidades.values.fold(0, (sum, quantity) => sum + quantity);
  double get total => items.fold(0, (sum, item) => sum + item.total);

  bool puedeAgregar(Producto producto) =>
      producto.disponible && (_cantidades[producto.id] ?? 0) < producto.stock;

  Future<bool> agregar(Producto producto) async {
    _ensureLoaded();
    if (!puedeAgregar(producto)) return false;

    _cantidades[producto.id] = (_cantidades[producto.id] ?? 0) + 1;
    notifyListeners();
    await _guardar();
    return true;
  }

  Future<void> incrementar(String productId) async {
    _ensureLoaded();
    final product = Producto.buscarPorId(productId);
    if (product == null || !puedeAgregar(product)) return;

    _cantidades[productId] = (_cantidades[productId] ?? 0) + 1;
    notifyListeners();
    await _guardar();
  }

  Future<void> decrementar(String productId) async {
    _ensureLoaded();
    final quantity = _cantidades[productId];
    if (quantity == null || quantity <= 1) return;

    _cantidades[productId] = quantity - 1;
    notifyListeners();
    await _guardar();
  }

  Future<void> quitar(String productId) async {
    _ensureLoaded();
    if (_cantidades.remove(productId) == null) return;

    notifyListeners();
    await _guardar();
  }

  Future<void> _guardar() {
    final preferences = _preferences;
    if (preferences == null) {
      throw StateError('El carrito local aún no se ha cargado.');
    }

    final encodedCart = jsonEncode(_cantidades);
    final write = _pendingSave.then((_) async {
      final saved = await preferences.setString(_storageKey, encodedCart);
      if (!saved) {
        throw StateError('No se pudo guardar el carrito en este dispositivo.');
      }
    });
    _pendingSave = write.catchError((Object _) {});
    return write;
  }

  void _ensureLoaded() {
    if (_preferences == null) {
      throw StateError('El carrito local aún no se ha cargado.');
    }
  }
}
