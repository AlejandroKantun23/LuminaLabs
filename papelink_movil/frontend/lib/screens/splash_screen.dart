import 'package:flutter/material.dart';
import 'package:frontend/screens/login_screen.dart';
import 'package:frontend/screens/main_shell_screen.dart';
import 'package:frontend/services/usuario_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _progreso;

  @override
  void initState() {
    super.initState();

    _progreso = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..forward();

    _iniciarApp();
  }

  Future<void> _iniciarApp() async {
    // Si el servidor tarda más de 3 segundos, devuelve null y sigue al login
    final sesionFuture = UsuarioService.verificarSesion()
        .timeout(const Duration(seconds: 3), onTimeout: () => null)
        .catchError((_) => null);

    await Future.delayed(const Duration(milliseconds: 2000));
    final usuario = await sesionFuture;

    if (!mounted) return;

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) =>
            usuario != null ? const MainShellScreen() : const LoginScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _progreso.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(225, 237, 236, 243),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.edit,
              color: Color.fromARGB(255, 60, 160, 226),
              size: 120,
            ),
            const SizedBox(height: 30),
            const Text(
              'Papelink',
              style: TextStyle(
                color: Color.fromARGB(255, 60, 160, 226),
                fontSize: 50,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: 350,
              child: AnimatedBuilder(
                animation: _progreso,
                builder: (context, child) {
                  return LinearProgressIndicator(
                    value: _progreso.value,
                    color: const Color.fromARGB(255, 60, 160, 226),
                    backgroundColor: const Color.fromARGB(255, 64, 98, 121),
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(10),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}