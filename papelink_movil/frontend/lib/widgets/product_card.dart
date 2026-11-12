import 'package:flutter/material.dart';
import 'package:frontend/models/producto.dart';

class ProductCard extends StatelessWidget {
  final Producto product;
  final bool canAdd;
  final VoidCallback onAdd;

  const ProductCard({
    super.key,
    required this.product,
    required this.canAdd,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFFF0F6FF),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                product.icono,
                size: 48,
                color: const Color(0xFF0088CC),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            product.nombre,
            textAlign: TextAlign.center,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: !product.disponible
                  ? const Color(0xFFFFEBEB)
                  : (product.stockBajo
                        ? const Color(0xFFFFF3E0)
                        : const Color(0xFFE6F4EA)),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              product.textoDisponibilidad,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: !product.disponible
                    ? Colors.red
                    : (product.stockBajo
                          ? Colors.orange.shade800
                          : const Color(0xFF1E7E34)),
              ),
            ),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                '\$${product.precio.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                ),
              ),
              if (product.unidad.isNotEmpty)
                Text(
                  ' ${product.unidad}',
                  style: const TextStyle(fontSize: 10, color: Colors.grey),
                ),
            ],
          ),
          const SizedBox(height: 6),
          InkWell(
            onTap: canAdd ? onAdd : null,
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: canAdd ? const Color(0xFF0088CC) : Colors.grey.shade300,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.add,
                color: canAdd ? Colors.white : Colors.grey.shade600,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
