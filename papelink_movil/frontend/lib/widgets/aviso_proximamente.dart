import 'package:flutter/material.dart';

class AvisoProximamente {
  static const Color _azul = Color(0xFF0A7FC4);

  static void mostrar(
    BuildContext context, {
    String titulo = 'Próximamente',
    String mensaje = 'Estas pantallas se crearán más adelante.',
  }) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(titulo),
        content: Text(mensaje),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Entendido', style: TextStyle(color: _azul)),
          ),
        ],
      ),
    );
  }
}