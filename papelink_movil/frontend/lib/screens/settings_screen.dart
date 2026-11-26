import 'package:flutter/material.dart';
import '../services/session_service.dart';
import 'login_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  static const Color _bgLight = Color(0xFFF6F8FA);
  static const Color _textDark = Color(0xFF1E293B);

  Future<void> _cerrarSesion(BuildContext context) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Cerrar sesión'),
        content: const Text('¿Seguro que deseas cerrar la sesión actual?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Cerrar sesión'),
          ),
        ],
      ),
    );

    if (confirmar == true && context.mounted) {
      await SessionService.cerrarSesion();

      if (!context.mounted) return;

      Navigator.of(context, rootNavigator: true).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgLight,
      appBar: AppBar(
        title: const Text(
          'Configuración',
          style: TextStyle(fontWeight: FontWeight.bold, color: _textDark),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE6ECF2)),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.notifications_outlined),
                  title: const Text('Notificaciones de pedidos'),
                  subtitle: const Text('Avisos cuando tu pedido esté listo'),
                  trailing: Switch(
                    value: false,
                    onChanged: null, // Se conectará después
                  ),
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.support_agent_outlined),
                  title: Text('Contacto con la papelería'),
                  subtitle: Text('Soporte y dudas sobre reservas'),
                  trailing: Icon(Icons.chevron_right),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.logout_rounded),
                  title: const Text('Cerrar sesión / Cambiar modo'),
                  subtitle: const Text('Salir de la cuenta actual'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => _cerrarSesion(context),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}