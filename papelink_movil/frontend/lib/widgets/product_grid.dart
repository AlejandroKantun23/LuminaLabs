import 'package:flutter/material.dart';
import 'package:frontend/models/producto.dart';
import 'package:frontend/services/carrito_service.dart';

import 'product_card.dart';

class ProductGrid extends StatelessWidget {
  const ProductGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final carrito = CarritoService.instance;
    return AnimatedBuilder(
      animation: carrito,
      builder: (context, _) => GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.68,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: Producto.catalogo.length,
        itemBuilder: (context, index) {
          final product = Producto.catalogo[index];
          return ProductCard(
            product: product,
            canAdd: carrito.puedeAgregar(product),
            onAdd: () => _addToCart(context, carrito, product),
          );
        },
      ),
    );
  }

  Future<void> _addToCart(
    BuildContext context,
    CarritoService carrito,
    Producto product,
  ) async {
    try {
      final added = await carrito.agregar(product);
      if (!added && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No hay existencias disponibles.')),
        );
      }
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('No se pudo guardar el carrito: $error')),
        );
      }
    }
  }
}
