import 'package:flutter/material.dart';

/// Línea de progreso: Recibido -> Confirmado -> Listo en tienda.
class ProgresoPedido extends StatelessWidget {
  const ProgresoPedido({super.key, required this.paso});

  final int paso;

  static const _etiquetas = ['Recibido', 'Confirmado', 'Listo en tienda'];
  static const _azul = Color(0xFF0088CC);
  static const _gris = Color(0xFFE2E8F0);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < _etiquetas.length; i++)
          Expanded(
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 2,
                        color: i == 0
                            ? Colors.transparent
                            : (paso >= i ? _azul : _gris),
                      ),
                    ),
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        color: paso >= i ? _azul : _gris,
                        shape: BoxShape.circle,
                      ),
                      child: paso >= i
                          ? const Icon(Icons.check, size: 14, color: Colors.white)
                          : null,
                    ),
                    Expanded(
                      child: Container(
                        height: 2,
                        color: i == _etiquetas.length - 1
                            ? Colors.transparent
                            : (paso > i ? _azul : _gris),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  _etiquetas[i],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: paso == i ? FontWeight.bold : FontWeight.w500,
                    color: paso >= i
                        ? const Color(0xFF1E293B)
                        : const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}