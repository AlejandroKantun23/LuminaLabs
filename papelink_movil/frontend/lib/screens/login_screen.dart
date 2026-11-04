import 'package:flutter/material.dart';
import 'package:papelink_mobile/screens/home.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _correoController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _ocultarPassword = true;

  static const Color azul = Color(0xFF0A7FC4);
  static const Color azulClaro = Color(0xFFE6F2FB);

  @override
  void dispose() {
    _correoController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _iniciarSesion() {
    final correo = _correoController.text.trim();
    final password = _passwordController.text;

    if (correo.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Llena todos los campos')),
      );
      return;
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const HomeScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Encabezado: logo + versión
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: azul,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.edit, color: Colors.white),
                        ),
                        const SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Text(
                                  'Papelink',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: azulClaro,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text(
                                    'POS',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: azul,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const Text(
                              'Control de Papelería',
                              style: TextStyle(fontSize: 11, color: azul),
                            ),
                          ],
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE3F7EE),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            '● v2.4',
                            style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFF0E9F6E),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Título
                    const Row(
                      children: [
                        Icon(Icons.lock_outline, size: 14, color: azul),
                        SizedBox(width: 4),
                        Text(
                          'ACCESO ADMINISTRATIVO',
                          style: TextStyle(
                            fontSize: 11,
                            color: azul,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Inicia sesión',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Accede para administrar inventario, emitir ventas de mostrador y gestionar tus pedidos.',
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
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.email_outlined),
                        hintText: 'caja1@papelink.com',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Contraseña
                    const Text(
                      'Contraseña',
                      style: TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _passwordController,
                      obscureText: _ocultarPassword,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.lock_outline),
                        hintText: 'Ingresa tu contraseña',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _ocultarPassword
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                          onPressed: () {
                            setState(() {
                              _ocultarPassword = !_ocultarPassword;
                            });
                          },
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        child: const Text(
                          '¿Olvidaste tu contraseña?',
                          style: TextStyle(color: azul, fontSize: 12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),

                    // Botón
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _iniciarSesion,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: azul,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Iniciar sesión  →',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Sucursal
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F8FB),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.store_outlined,
                              size: 16, color: azul),
                          const SizedBox(width: 6),
                          const Text(
                            'Sucursal Centro',
                            style: TextStyle(fontSize: 12),
                          ),
                          const Spacer(),
                          GestureDetector(
                            onTap: () {},
                            child: const Text(
                              'Cambiar',
                              style: TextStyle(
                                fontSize: 12,
                                color: azul,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Divider(),

                    // Contacto
                    const Center(
                      child: Text(
                        '¿Necesitas acceso a Papelink?',
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ),
                    Center(
                      child: TextButton(
                        onPressed: () {},
                        child: const Text(
                          'Contacta a tu administrador',
                          style: TextStyle(
                            color: azul,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const Center(
                      child: Text(
                        '🛡 Conexión cifrada SSL, punto de venta',
                        style: TextStyle(color: Colors.grey, fontSize: 10),
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