import 'package:flutter/material.dart';
import 'package:frontend/screens/cart_screen.dart';
import 'package:frontend/services/carrito_service.dart';

class HomeCartFab extends StatelessWidget {
  const HomeCartFab({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: CarritoService.instance,
      builder: (context, _) => Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            height: 60,
            width: 60,
            decoration: BoxDecoration(
              color: const Color(0xFF0088CC),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0088CC).withValues(alpha: 0.4),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: IconButton(
              icon: const Icon(
                Icons.shopping_bag_outlined,
                color: Colors.white,
                size: 28,
              ),
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => const CartScreen()),
                );
              },
            ),
          ),
          if (CarritoService.instance.totalPiezas > 0)
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
                child: Text(
                  '${CarritoService.instance.totalPiezas}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
