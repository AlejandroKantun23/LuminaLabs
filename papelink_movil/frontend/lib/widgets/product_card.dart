import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  final String title;
  final String dispo;
  final bool inStock;
  final bool isLowStock;
  final String price;
  final String unit;
  final IconData icon;

  const ProductCard({
    super.key,
    required this.title,
    required this.dispo,
    required this.inStock,
    required this.isLowStock,
    required this.price,
    required this.unit,
    required this.icon,
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
            color: Colors.black.withOpacity(0.02),
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
              child: Icon(icon, size: 48, color: const Color(0xFF0088CC)),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: !inStock
                  ? const Color(0xFFFFEBEB)
                  : (isLowStock ? const Color(0xFFFFF3E0) : const Color(0xFFE6F4EA)),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              dispo,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: !inStock
                    ? Colors.red
                    : (isLowStock ? Colors.orange.shade800 : const Color(0xFF1E7E34)),
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
                price,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
              if (unit.isNotEmpty)
                Text(
                  ' $unit',
                  style: const TextStyle(fontSize: 10, color: Colors.grey),
                ),
            ],
          ),
          const SizedBox(height: 6),
          InkWell(
            onTap: inStock ? () {} : null,
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: inStock ? const Color(0xFF0088CC) : Colors.grey.shade300,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.add,
                color: inStock ? Colors.white : Colors.grey.shade600,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}