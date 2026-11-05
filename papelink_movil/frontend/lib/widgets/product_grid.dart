import 'package:flutter/material.dart';
import 'product_card.dart';

class ProductGrid extends StatelessWidget {
  const ProductGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final products = [
      {
        'title': 'Lápiz Grafito HB',
        'dispo': '15 dispo.',
        'inStock': true,
        'price': '\$10.00',
        'unit': 'c/u',
        'icon': Icons.edit,
      },
      {
        'title': 'Borrador Blanco',
        'dispo': '19 dispo.',
        'inStock': true,
        'price': '\$7.00',
        'unit': 'c/u',
        'icon': Icons.layers_clear,
      },
      {
        'title': 'Libreta Raya 100h',
        'dispo': '6 dispo.',
        'inStock': true,
        'price': '\$25.00',
        'unit': 'c/u',
        'isLowStock': true,
        'icon': Icons.article_outlined,
      },
      {
        'title': 'Paq. Papel Bond 500h',
        'dispo': '¡Sin existencia!',
        'inStock': false,
        'price': '\$159.99',
        'unit': '',
        'icon': Icons.view_in_ar,
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.68,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final item = products[index];
        final bool inStock = item['inStock'] as bool;
        final bool isLowStock = item['isLowStock'] as bool? ?? false;

        return ProductCard(
          title: item['title'] as String,
          dispo: item['dispo'] as String,
          inStock: inStock,
          isLowStock: isLowStock,
          price: item['price'] as String,
          unit: item['unit'] as String,
          icon: item['icon'] as IconData,
        );
      },
    );
  }
}