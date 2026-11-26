import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/usuario.dart';
import 'session_service.dart';

class AuthException implements Exception {
  final String mensaje;
  const AuthException(this.mensaje);

  @override
  String toString() => mensaje;
}

class UsuarioService {
  static Future<Usuario> login({
    required String correo,
    required String password,
  }) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/login');

    try {
      final response = await http
          .post(
            uri,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode({
              'email': correo.trim(),
              'password': password,
            }),
          )
          .timeout(ApiConfig.timeout);

      final Map<String, dynamic> body = response.body.isNotEmpty
          ? jsonDecode(response.body) as Map<String, dynamic>
          : {};

      if (response.statusCode == 200) {
        final String? token = body['token'] as String?;
        final dynamic userJson = body['user'];

        if (token == null || token.isEmpty || userJson is! Map<String, dynamic>) {
          throw const AuthException('Respuesta inválida del servidor.');
        }

        final usuario = Usuario.fromJson(userJson);
        await SessionService.guardarSesion(token: token, usuario: usuario);
        return usuario;
      }

      if (response.statusCode >= 400 && response.statusCode < 500) {
        final mensajeBackend = body['message'] ?? body['error'];
        throw AuthException(
          mensajeBackend?.toString() ?? 'No se pudo iniciar sesión.',
        );
      }

      throw AuthException(
        'Error del servidor (${response.statusCode}). Intenta más tarde.',
      );
    } on AuthException {
      rethrow;
    } on SocketException {
      throw const AuthException(
        'No se pudo conectar con el servidor. Verifica que el backend esté activo.',
      );
    } on TimeoutException {
      throw const AuthException(
        'El servidor tardó demasiado en responder. Intenta de nuevo.',
      );
    } on FormatException {
      throw const AuthException(
        'El servidor devolvió un formato inesperado.',
      );
    }
  }

  static Future<void> register({
    required String nombre,
    required String email,
    required String password,
    String? telefono,
  }) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/register');

    try {
      final response = await http
          .post(
            uri,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode({
              'nombre': nombre.trim(),
              'email': email.trim(),
              'password': password,
              if (telefono != null && telefono.trim().isNotEmpty)
                'telefono': telefono.trim(),
            }),
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 201) return;

      final Map<String, dynamic> body = response.body.isNotEmpty
          ? jsonDecode(response.body) as Map<String, dynamic>
          : {};

      if (response.statusCode >= 400 && response.statusCode < 500) {
        final mensajeBackend = body['message'] ?? body['error'];
        throw AuthException(
          mensajeBackend?.toString() ?? 'No se pudo completar el registro.',
        );
      }

      throw AuthException(
        'Error del servidor (${response.statusCode}). Intenta más tarde.',
      );
    } on AuthException {
      rethrow;
    } on SocketException {
      throw const AuthException(
        'No se pudo conectar con el servidor. Verifica que el backend esté activo.',
      );
    } on TimeoutException {
      throw const AuthException(
        'El servidor tardó demasiado en responder. Intenta de nuevo.',
      );
    } on FormatException {
      throw const AuthException(
        'El servidor devolvió un formato inesperado.',
      );
    }
  }

  static Future<Usuario?> verificarSesion() async {
    final token = await SessionService.obtenerToken();
    if (token == null || token.isEmpty) return null;

    final uri = Uri.parse('${ApiConfig.baseUrl}/auth/me');

    try {
      final response = await http
          .get(
            uri,
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer $token',
            },
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        final usuario = Usuario.fromJson(data);
        await SessionService.guardarSesion(token: token, usuario: usuario);
        return usuario;
      }

      if (response.statusCode == 401 || response.statusCode == 403) {
        await SessionService.cerrarSesion();
        return null;
      }

      return null;
    } catch (_) {
      return null;
    }
  }

  static Future<void> logout() async {
    await SessionService.cerrarSesion();
  }

  // Temporales mientras agregas los endpoints de recuperación en el backend
  static bool existeCorreo(String correo) => false;
  static bool cambiarPassword(String correo, String nuevaPassword) => false;
}
