import 'package:flutter/material.dart';

import '../models/usuario.dart';
import '../services/session_service.dart';
import '../services/usuario_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  static const Color _primaryBlue = Color(0xFF0077C8);
  static const Color _bgLight = Color(0xFFF6F8FA);
  static const Color _textDark = Color(0xFF1E293B);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<Usuario?> _usuarioFuture;

  @override
  void initState() {
    super.initState();
    _usuarioFuture = _cargarUsuario();
  }

  Future<Usuario?> _cargarUsuario() async {
    final usuarioServidor = await UsuarioService.verificarSesion();
    return usuarioServidor ?? await SessionService.obtenerUsuario();
  }

  void _recargar() {
    setState(() {
      _usuarioFuture = _cargarUsuario();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ProfileScreen._bgLight,
      appBar: AppBar(
        title: const Text(
          'Perfil',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: ProfileScreen._textDark,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        actions: [
          IconButton(
            onPressed: _recargar,
            tooltip: 'Actualizar perfil',
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: FutureBuilder<Usuario?>(
        future: _usuarioFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return _mensajeEstado(
              icon: Icons.error_outline,
              mensaje: 'No se pudieron cargar los datos de la cuenta.',
            );
          }

          final usuario = snapshot.data;
          if (usuario == null) {
            return _mensajeEstado(
              icon: Icons.person_outline,
              mensaje: 'No hay una sesión activa.',
            );
          }

          return _contenidoPerfil(usuario);
        },
      ),
    );
  }

  Widget _mensajeEstado({required IconData icon, required String mensaje}) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 48, color: ProfileScreen._primaryBlue),
            const SizedBox(height: 12),
            Text(
              mensaje,
              textAlign: TextAlign.center,
              style: const TextStyle(color: ProfileScreen._textDark),
            ),
          ],
        ),
      ),
    );
  }

  Widget _contenidoPerfil(Usuario usuario) {
    final rol = switch (usuario.rol) {
      'cliente' => 'Cliente',
      'empleado' => 'Empleado',
      'admin' => 'Administrador',
      _ => usuario.rol,
    };

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE6ECF2)),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Color(0xFFE0F2FE),
                  child: Icon(
                    Icons.person_rounded,
                    size: 32,
                    color: ProfileScreen._primaryBlue,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        usuario.nombre,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: ProfileScreen._textDark,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        usuario.email,
                        style: const TextStyle(
                          fontSize: 13,
                          color: Colors.grey,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        rol,
                        style: const TextStyle(
                          fontSize: 12,
                          color: ProfileScreen._primaryBlue,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE6ECF2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Datos de contacto',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: ProfileScreen._textDark,
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  initialValue: usuario.telefono ?? 'No registrado',
                  enabled: false,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    labelText: 'Teléfono móvil',
                    prefixIcon: const Icon(Icons.phone_outlined),
                    filled: true,
                    fillColor: ProfileScreen._bgLight,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                const Text(
                  'La edición del perfil no está disponible todavía.',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ProfileScreen._primaryBlue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Editar datos (no disponible)'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
