import 'package:flutter/material.dart';
import '../models/pedido.dart';
import '../services/pedido_service.dart';
import '../widgets/detalle_pedido_sheet.dart';
import '../widgets/home_header.dart';
import '../widgets/pedido_card.dart';
import 'login_screen.dart';

class PedidosScreen extends StatefulWidget {
  const PedidosScreen({super.key});

  @override
  State<PedidosScreen> createState() => PedidosScreenState();
}

// El estado es público para que la barra de navegación pueda llamar recargar()
// cada vez que el cliente entra a esta pestaña.
class PedidosScreenState extends State<PedidosScreen> {
  List<Pedido> _pedidos = [];
  bool _cargando = true;
  String? _error;
  bool _verHistorial = false;

  @override
  void initState() {
    super.initState();
    recargar();
  }

  Future<void> recargar() async {
    if (!mounted) return;
    setState(() {
      _error = null;
      if (_pedidos.isEmpty) _cargando = true;
    });

    try {
      final lista = await PedidoService.listarMisPedidos();
      if (!mounted) return;
      setState(() {
        _pedidos = lista;
        _cargando = false;
      });
    } on PedidoException catch (e) {
      if (!mounted) return;
      if (e.sesionExpirada) {
        _irALogin();
        return;
      }
      setState(() {
        _error = e.mensaje;
        _cargando = false;
      });
    }
  }

  void _irALogin() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final activos = _pedidos.where((p) => p.activo).length;
    final visibles =
        _pedidos.where((p) => _verHistorial ? !p.activo : p.activo).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FA),
      appBar: const HomeHeader(),
      body: RefreshIndicator(
        onRefresh: recargar,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          children: [
            _buildHeader(activos),
            const SizedBox(height: 16),
            _buildFiltros(),
            const SizedBox(height: 16),
            if (_cargando)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 48),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_error != null)
              _buildError(_error!)
            else if (visibles.isEmpty)
              _buildVacio()
            else
              ...visibles.map(
                (pedido) => PedidoCard(
                  pedido: pedido,
                  onTap: () => _abrirDetalle(pedido),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(int activos) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mis pedidos',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              SizedBox(height: 4),
              Text(
                'Apartados para recoger y pagar en tienda',
                style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFFE0F2FE),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            '$activos en proceso',
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

  Widget _buildFiltros() {
    Widget chip(String texto, bool historial) {
      final activo = _verHistorial == historial;
      return Padding(
        padding: const EdgeInsets.only(right: 8),
        child: ChoiceChip(
          label: Text(texto),
          selected: activo,
          onSelected: (_) => setState(() => _verHistorial = historial),
          selectedColor: const Color(0xFF0088CC),
          backgroundColor: Colors.white,
          labelStyle: TextStyle(
            color: activo ? Colors.white : const Color(0xFF64748B),
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
          showCheckmark: false,
          side: const BorderSide(color: Color(0xFFE6ECF2)),
        ),
      );
    }

    return Row(children: [chip('En proceso', false), chip('Historial', true)]);
  }

  Widget _buildVacio() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Center(
        child: Column(
          children: [
            const Icon(
              Icons.receipt_long_outlined,
              size: 48,
              color: Color(0xFFCBD5E1),
            ),
            const SizedBox(height: 12),
            Text(
              _verHistorial
                  ? 'Todavía no tienes pedidos en el historial.'
                  : 'No tienes pedidos en proceso. Agrega productos al carrito y apártalos.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFF64748B)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildError(String mensaje) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFECACA)),
      ),
      child: Column(
        children: [
          Text(
            mensaje,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFFB91C1C), fontSize: 13),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: recargar,
            child: const Text('Reintentar'),
          ),
        ],
      ),
    );
  }

  Future<void> _abrirDetalle(Pedido pedido) async {
    final cancelado = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => DetallePedidoSheet(pedido: pedido),
    );

    if (cancelado == true && mounted) {
      await recargar();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Apartado cancelado.')),
      );
    }
  }
}