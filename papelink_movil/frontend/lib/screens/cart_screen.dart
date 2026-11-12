import 'package:flutter/material.dart';
import 'package:frontend/models/producto.dart';
import 'package:frontend/services/carrito_service.dart';
import 'package:frontend/widgets/home_header.dart';
import 'package:frontend/screens/home_screen.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  @override
  Widget build(BuildContext context) {
    final carrito = CarritoService.instance;
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FA),
      appBar: HomeHeader(
        onBack: () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const HomeScreen()),
          );
        },
      ),
      body: AnimatedBuilder(
        animation: carrito,
        builder: (context, _) {
          final items = carrito.items;
          final total = carrito.total;
          final subtotal = total / 1.16;
          final iva = total - subtotal;

          return Stack(
            children: [
              ListView(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 260),
                children: [
                  _buildCartHeader(carrito.totalArticulos),
                  const SizedBox(height: 16),
                  if (items.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 48),
                      child: Center(
                        child: Text('Tu carrito está vacío. Agrega productos.'),
                      ),
                    )
                  else
                    ...items.map((item) => _buildCartCard(item, carrito)),
                ],
              ),
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: _buildSummaryBottomSheet(
                  totalPieces: carrito.totalPiezas,
                  subtotal: subtotal,
                  iva: iva,
                  total: total,
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildCartHeader(int itemCount) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              'Carrito de compras',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Venta en curso #POS-4892',
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFFE0F2FE),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            '$itemCount artículos',
            style: const TextStyle(
              color: Color(0xFF0369A1),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCartCard(ItemCarrito item, CarritoService carrito) {
    final product = item.producto;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icono del producto
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F9FF),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  product.icono,
                  color: const Color(0xFF0284C7),
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              // Información del producto
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.nombre,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: product.stockBajo
                                ? Colors.amber[700]
                                : const Color(0xFF10B981),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          product.textoDisponibilidad,
                          style: TextStyle(
                            fontSize: 12,
                            color: product.stockBajo
                                ? Colors.amber[800]
                                : const Color(0xFF059669),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const Text(
                          '  •  ',
                          style: TextStyle(color: Color(0xFF94A3B8)),
                        ),
                        Text(
                          '\$${product.precio.toStringAsFixed(2)} ${product.unidad}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Botón de eliminar
              IconButton(
                icon: const Icon(
                  Icons.delete_outline,
                  color: Color(0xFFCBD5E1),
                  size: 20,
                ),
                onPressed: () =>
                    _runCartAction(() => carrito.quitar(product.id)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Subtotal y Contadores (+ -)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RichText(
                text: TextSpan(
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                  ),
                  children: [
                    const TextSpan(text: 'Total parcial: '),
                    TextSpan(
                      text: '\$${item.total.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                  ],
                ),
              ),
              // Botones de incremento/decremento
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    _buildCounterButton(
                      icon: Icons.remove,
                      color: Colors.white,
                      textColor: const Color(0xFF64748B),
                      onTap: () =>
                          _runCartAction(() => carrito.decrementar(product.id)),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Text(
                        '${item.cantidad}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                    ),
                    _buildCounterButton(
                      icon: Icons.add,
                      color: carrito.puedeAgregar(product)
                          ? const Color(0xFF0088CC)
                          : Colors.grey.shade300,
                      textColor: carrito.puedeAgregar(product)
                          ? Colors.white
                          : Colors.grey.shade600,
                      onTap: carrito.puedeAgregar(product)
                          ? () => _runCartAction(
                              () => carrito.incrementar(product.id),
                            )
                          : () {},
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _runCartAction(Future<void> Function() action) async {
    try {
      await action();
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo guardar el carrito: $error')),
      );
    }
  }

  Widget _buildCounterButton({
    required IconData icon,
    required Color color,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(8),
          boxShadow: color == Colors.white
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 4,
                  ),
                ]
              : null,
        ),
        child: Icon(icon, size: 16, color: textColor),
      ),
    );
  }

  // --- PANEL INFERIOR / RESUMEN DE COMPRA ---
  Widget _buildSummaryBottomSheet({
    required int totalPieces,
    required double subtotal,
    required double iva,
    required double total,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Indicador superior del BottomSheet
          Container(
            width: 36,
            height: 4,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: const Color(0xFFE2E8F0),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Subtotal
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Subtotal ($totalPieces piezas)',
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
              ),
              Text(
                '\$${subtotal.toStringAsFixed(2)} MXN',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF334155),
                  fontSize: 13,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          // IVA
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'IVA incluido (16%)',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
              ),
              Text(
                '\$${iva.toStringAsFixed(2)} MXN',
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Total
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              const Text(
                'Total',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    '\$${total.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Text(
                    'MXN',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0284C7),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Botón Principal: Apartar pedido
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.archive_outlined, size: 20),
              label: const Text(
                'Apartar pedido',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0088CC),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
