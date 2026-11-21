import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  static const Color _bgLight = Color(0xFFF6F8FA);
  static const Color _textDark = Color(0xFF1E293B);

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
                const ListTile(
                  leading: Icon(Icons.logout_rounded),
                  title: Text('Cerrar sesión / Cambiar modo'),
                  subtitle: Text('Pendiente de conectar con sesión'),
                  trailing: Icon(Icons.chevron_right),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}