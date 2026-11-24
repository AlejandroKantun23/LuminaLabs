import 'package:flutter/material.dart';
import '../models/pedido.dart';

/// Colores de la etiqueta de cada estado: (fondo, texto).
(Color, Color) coloresEstadoPedido(String estado) {
  switch (estado) {
    case 'pendiente':
      return (const Color(0xFFFEF3C7), const Color(0xFF92400E));
    case 'confirmado_apartado':
      return (const Color(0xFFE0F2FE), const Color(0xFF0369A1));
    case 'listo_en_tienda':
      return (const Color(0xFFD1FAE5), const Color(0xFF047857));
    case 'completado':
      return (const Color(0xFFF1F5F9), const Color(0xFF475569));
    default:
      return (const Color(0xFFFEE2E2), const Color(0xFFB91C1C));
  }
}

String _dosDigitos(int n) => n.toString().padLeft(2, '0');

String formatearFechaPedido(DateTime d) =>
    '${_dosDigitos(d.day)}/${_dosDigitos(d.month)}/${d.year} '
    '${_dosDigitos(d.hour)}:${_dosDigitos(d.minute)} h';

class BadgeEstadoPedido extends StatelessWidget {
  const BadgeEstadoPedido({
    super.key,
    required this.texto,
    required this.colores,
  });

  final String texto;
  final (Color, Color) colores;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: colores.$1,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        texto,
        style: TextStyle(
          color: colores.$2,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class PedidoCard extends StatelessWidget {
  const PedidoCard({
    super.key,
    required this.pedido,
    required this.onTap,
  });

  final Pedido pedido;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colores = coloresEstadoPedido(pedido.estado);
    final textoArticulos =
        pedido.articulos == 1 ? '1 artículo' : '${pedido.articulos} artículos';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0F9FF),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.receipt_long_outlined,
                        color: Color(0xFF0284C7),
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            pedido.folio,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1E293B),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            pedido.fechaCreacion == null
                                ? 'Pedido realizado'
                                : 'Pedido del ${formatearFechaPedido(pedido.fechaCreacion!)}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    BadgeEstadoPedido(
                      texto: pedido.etiquetaEstado,
                      colores: colores,
                    ),
                  ],
                ),
                if (pedido.resumen != null && pedido.resumen!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Text(
                    pedido.resumen!,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF475569),
                    ),
                  ),
                ],
                if (pedido.activo && pedido.fechaLimite != null) ...[
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Icon(
                        Icons.schedule,
                        size: 15,
                        color: Color(0xFF94A3B8),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Recoge antes del ${formatearFechaPedido(pedido.fechaLimite!)}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 12),
                const Divider(height: 1, color: Color(0xFFF1F5F9)),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      textoArticulos,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          '\$${pedido.total.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Text(
                          'MXN',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0284C7),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}