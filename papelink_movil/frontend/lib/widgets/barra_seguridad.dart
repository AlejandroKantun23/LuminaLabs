import 'package:flutter/material.dart';

class BarraSeguridad extends StatelessWidget {
  final String password;

  const BarraSeguridad({super.key, required this.password});

  // Cuenta cuántos requisitos cumple la contraseña (0 a 4)
  static int nivel(String p) {
    int n = 0;
    if (p.length > 4) n++; // más de 4 caracteres
    if (RegExp(r'[A-Z]').hasMatch(p)) n++; // una mayúscula
    if (RegExp(r'[0-9]').hasMatch(p)) n++; // un número
    if (RegExp(r'[^A-Za-z0-9\s]').hasMatch(p)) n++; // un símbolo
    return n;
  }

  Color _color(int n) {
    switch (n) {
      case 1:
        return Colors.red;
      case 2:
        return Colors.orange;
      case 3:
        return Colors.amber;
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    final n = nivel(password);
    final etiquetas = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: List.generate(4, (i) {
            return Expanded(
              child: Container(
                height: 5,
                margin: EdgeInsets.only(right: i < 3 ? 4 : 0),
                decoration: BoxDecoration(
                  color: i < n ? _color(n) : Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 6),
        Text(
          etiquetas[n],
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: n == 0 ? Colors.grey : _color(n),
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Debe tener mayúscula, número, símbolo (\$ # " . !) y más de 4 caracteres.',
          style: TextStyle(color: Colors.grey, fontSize: 11),
        ),
      ],
    );
  }
}