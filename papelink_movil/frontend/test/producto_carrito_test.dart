import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/models/producto.dart';
import 'package:frontend/services/carrito_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('el catálogo centraliza disponibilidad y características', () {
    final lapiz = Producto.buscarPorId('lapiz-grafito-hb');
    final papel = Producto.buscarPorId('papel-bond-500h');

    expect(lapiz?.precio, 10);
    expect(lapiz?.stock, 15);
    expect(lapiz?.disponible, isTrue);
    expect(papel?.disponible, isFalse);
    expect(papel?.textoDisponibilidad, '¡Sin existencia!');
  });

  test('el carrito comparte cantidades y las guarda localmente', () async {
    SharedPreferences.setMockInitialValues({});
    final carrito = CarritoService.instance;
    await carrito.cargar();

    final lapiz = Producto.buscarPorId('lapiz-grafito-hb')!;
    expect(await carrito.agregar(lapiz), isTrue);
    expect(carrito.totalPiezas, 1);
    expect(carrito.total, 10);

    final preferences = await SharedPreferences.getInstance();
    final savedCart = jsonDecode(
      preferences.getString('carrito_productos_v1')!,
    );
    expect(savedCart, {'lapiz-grafito-hb': 1});

    await carrito.quitar(lapiz.id);
    expect(carrito.items, isEmpty);
  });
}
