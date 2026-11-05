import 'package:flutter/material.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          children: [
            Row(
              children: [
                Container(
                  width: 10,
                  height: 10,
                  decoration: const BoxDecoration(
                    color: Color(0xFF0088CC),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 4),
                RichText(
                  
                  text: const TextSpan(
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    children: [
                      TextSpan(text: 'Pape', style: TextStyle(color: Color(0xFF1E293B))),
                      TextSpan(text: 'link', style: TextStyle(color: Color(0xFF0088CC))),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 2), 
          ],
        ),
        // Espaciador para centrar el logo correctamente
        const SizedBox(width: 48),
      ],
    );
  }
}