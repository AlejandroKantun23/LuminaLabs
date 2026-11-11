import 'package:flutter/material.dart';
import 'package:frontend/widgets/home_header.dart';

// Modelo para los productos
class CartItem {
  final String name;
  final int stock;
  final double unitPrice;
  int quantity;
  final IconData icon;

  CartItem({
    required this.name,
    required this.stock,
    required this.unitPrice,
    required this.quantity,
    required this.icon,
  });

  double get totalPrice => unitPrice * quantity;
}

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  // Datos de ejemplo basados en la pantalla
  final List<CartItem> _items = [
    CartItem(
      name: 'Lápiz de grafito',
      stock: 15,
      unitPrice: 10.00,
      quantity: 5,
      icon: Icons.edit_outlined,
    ),
    CartItem(
      name: 'Borrador escolar',
      stock: 19,
      unitPrice: 7.00,
      quantity: 2,
      icon: Icons.cleaning_services_outlined,
    ),
    CartItem(
      name: 'Libreta profesional',
      stock: 6,
      unitPrice: 25.00,
      quantity: 1,
      icon: Icons.menu_book_rounded,
    ),
  ];

  int get _totalPieces =>
      _items.fold(0, (sum, item) => sum + item.quantity);

  double get _totalAmount =>
      _items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double get _subtotal => _totalAmount / 1.16;
  double get _iva => _totalAmount - _subtotal;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FA),
      appBar: HomeHeader(),
      body: Stack(
        children: [
          // Contenido desplazable (Header del carrito + Lista)
          ListView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 260), // Espacio para el panel inferior
            children: [
              _buildCartHeader(),
              const SizedBox(height: 16),
              ..._items.map((item) => _buildCartCard(item)),
            ],
          ),

          // Resumen flotante en la parte inferior
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _buildSummaryBottomSheet(),
          ),
        ],
      ),
    );
  }

  // --- HEADER DE CARRITO ---
  Widget _buildCartHeader() {
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
              style: TextStyle(
                fontSize: 13,
                color: Color(0xFF64748B),
              ),
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
            '${_items.length} artículos',
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

  // --- TARJETA DE PRODUCTO ---
  Widget _buildCartCard(CartItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
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
                child: Icon(item.icon, color: const Color(0xFF0284C7), size: 24),
              ),
              const SizedBox(width: 12),
              // Información del producto
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.name,
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
                            color: item.stock <= 6
                                ? Colors.amber[700]
                                : const Color(0xFF10B981),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${item.stock} dispo.',
                          style: TextStyle(
                            fontSize: 12,
                            color: item.stock <= 6
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
                          '\$${item.unitPrice.toStringAsFixed(2)} c/u',
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
                icon: const Icon(Icons.delete_outline,
                    color: Color(0xFFCBD5E1), size: 20),
                onPressed: () {
                  setState(() {
                    _items.remove(item);
                  });
                },
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
                  style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                  children: [
                    const TextSpan(text: 'Total parcial: '),
                    TextSpan(
                      text: '\$${item.totalPrice.toStringAsFixed(2)}',
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
                      onTap: () {
                        if (item.quantity > 1) {
                          setState(() => item.quantity--);
                        }
                      },
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Text(
                        '${item.quantity}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                    ),
                    _buildCounterButton(
                      icon: Icons.add,
                      color: const Color(0xFF0088CC),
                      textColor: Colors.white,
                      onTap: () {
                        setState(() => item.quantity++);
                      },
                    ),
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
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
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 4,
                  )
                ]
              : null,
        ),
        child: Icon(icon, size: 16, color: textColor),
      ),
    );
  }

  // --- PANEL INFERIOR / RESUMEN DE COMPRA ---
  Widget _buildSummaryBottomSheet() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
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
                'Subtotal ($_totalPieces piezas)',
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
              ),
              Text(
                '\$${_subtotal.toStringAsFixed(2)} MXN',
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
                '\$${_iva.toStringAsFixed(2)} MXN',
                style: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 12,
                ),
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
                    '\$${_totalAmount.toStringAsFixed(2)}',
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
