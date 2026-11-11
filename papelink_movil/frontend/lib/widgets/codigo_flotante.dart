import 'package:flutter/material.dart';

class CodigoFlotante {
  static const Color _azul = Color(0xFF0A7FC4);

  static void mostrar(BuildContext context, String codigo) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Row(
          children: [
            Icon(Icons.mark_email_unread_outlined, color: _azul),
            SizedBox(width: 8),
            Text('Tu código'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Este sería el código que llegaría a tu correo:',
              style: TextStyle(color: Colors.grey, fontSize: 13),
            ),
            const SizedBox(height: 16),
            Text(
              codigo,
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                letterSpacing: 8,
                color: _azul,
              ),
            ),
          ],
        ),
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