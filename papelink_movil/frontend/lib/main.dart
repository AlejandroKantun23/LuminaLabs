import 'package:flutter/material.dart';
import 'package:frontend/screens/splash_screen.dart';
import 'package:frontend/services/carrito_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await CarritoService.instance.cargar();
  runApp(const Papelink());
}

class Papelink extends StatelessWidget {
  const Papelink({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Papelink",
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}
