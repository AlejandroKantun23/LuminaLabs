import 'package:flutter/material.dart';
import 'package:frontend/screens/contactos_screen.dart';
import 'package:frontend/screens/newpassword_screen.dart';
import 'package:frontend/services/codigo_service.dart';
import 'package:frontend/services/usuario_service.dart';
import 'package:frontend/widgets/codigo_flotante.dart';

class RecoveryPasswordScreen extends StatefulWidget {
  const RecoveryPasswordScreen({super.key});

  @override
  State<RecoveryPasswordScreen> createState() =>
      _RecoveryPasswordScreenState();
}

class _RecoveryPasswordScreenState extends State<RecoveryPasswordScreen> {
  final TextEditingController _correoController = TextEditingController();
  final TextEditingController _codigoController = TextEditingController();
  bool _codigoEnviado = false;

  static const Color azul = Color(0xFF0A7FC4);

  @override
  void dispose() {
    _correoController.dispose();
    _codigoController.dispose();
    super.dispose();
  }

  void _enviarCodigo() {
    final correo = _correoController.text.trim();

    if (correo.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Escribe tu correo primero')),
      );
      return;
    }

    if (!UsuarioService.existeCorreo(correo)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ese correo no está registrado')),
      );
      return;
    }

    final codigo = CodigoService.generar();
    setState(() {
      _codigoEnviado = true;
    });
    CodigoFlotante.mostrar(context, codigo);
  }

  void _continuar() {
    final codigo = _codigoController.text.trim();

    if (!_codigoEnviado) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Primero solicita tu código')),
      );
      return;
    }

    if (codigo.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Escribe el código')),
      );
      return;
    }

    if (!CodigoService.validar(codigo)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Código incorrecto')),
      );
      return;
    }

    final correo = _correoController.text.trim();
    CodigoService.limpiar();

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => NewPasswordScreen(correo: correo),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Papelink',
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
                    const Text(
                      'Recuperar contraseña',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Ingresa tu correo para recibir un código de seguridad.',
                      style: TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                    const SizedBox(height: 20),

                    // Correo
                    const Text(
                      'Correo electrónico',
                      style: TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _correoController,
                      keyboardType: TextInputType.emailAddress,
                      onChanged: (_) {
                        // si cambia el correo, el código anterior ya no sirve
                        CodigoService.limpiar();
                        setState(() {
                          _codigoEnviado = false;
                        });
                      },
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.email_outlined),
                        hintText: 'nombre@correo.com',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Código
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Código de verificación',
                          style: TextStyle(fontSize: 12),
                        ),
                        Text(
                          '4 dígitos',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _codigoController,
                      keyboardType: TextInputType.number,
                      maxLength: 4,
                      decoration: InputDecoration(
                        counterText: '',
                        prefixIcon: const Icon(Icons.key_outlined),
                        hintText: 'Ingresa tu código',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text(
                            '¿No recibiste el código?',
                            style: TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                          TextButton(
                            onPressed: _enviarCodigo,
                            child: Text(
                              _codigoEnviado ? 'Reenviar' : 'Enviar código',
                              style: const TextStyle(
                                color: azul,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),

                    // Botón
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _continuar,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: azul,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Continuar  →',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Divider(),

                    // Abajo
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          '¿Recordaste tu contraseña?',
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text(
                            'Iniciar sesión',
                            style: TextStyle(
                              color: azul,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          '¿Tienes dudas?',
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const ContactosScreen(),
                              ),
                            );
                          },
                          child: const Text(
                            'Contáctanos',
                            style: TextStyle(
                              color: azul,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
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