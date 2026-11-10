import 'package:flutter/material.dart';

class ContactosScreen extends StatelessWidget {
  const ContactosScreen({super.key});

  static const Color azul = Color(0xFF0A7FC4);

  static const List<String> integrantes = [
    'Jose Alejandro Kantun Mukul',
    'Angel de Jesus Arizmendi Reyes',
    'Luis Angel Peraza Cupul',
    'Carlos Said Loria Gil',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Contáctanos',
          style: TextStyle(fontWeight: FontWeight.bold, color: azul),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.white, Color(0xFFDCEBF8)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x14000000),
                      blurRadius: 20,
                      offset: Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: azul,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.groups, color: Colors.white),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Somos LuminaLabs',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Los encargados de la aplicación de Papelink.',
                      style: TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                    const SizedBox(height: 20),
                    const Divider(),
                    const SizedBox(height: 8),
                    const Text(
                      'Nuestro equipo',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: azul,
                      ),
                    ),
                    const SizedBox(height: 10),
                    ...integrantes.map(
                      (nombre) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          children: [
                            const Icon(Icons.person_outline,
                                size: 20, color: azul),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                nombre,
                                style: const TextStyle(fontSize: 14),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}