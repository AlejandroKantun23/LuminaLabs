import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/usuario.dart';

class SessionService {
  static const _storage = FlutterSecureStorage();

  static const _keyToken = 'auth_token';
  static const _keyUsuario = 'auth_usuario';

  static Future<void> guardarSesion({
    required String token,
    required Usuario usuario,
  }) async {
    await _storage.write(key: _keyToken, value: token);
    await _storage.write(
      key: _keyUsuario,
      value: jsonEncode(usuario.toJson()),
    );
  }

  static Future<String?> obtenerToken() async {
    return _storage.read(key: _keyToken);
  }

  static Future<Usuario?> obtenerUsuario() async {
    final raw = await _storage.read(key: _keyUsuario);
    if (raw == null || raw.isEmpty) return null;
    return Usuario.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  static Future<bool> tieneSesionActiva() async {
    final token = await obtenerToken();
    return token != null && token.isNotEmpty;
  }

  static Future<void> cerrarSesion() async {
    await _storage.delete(key: _keyToken);
    await _storage.delete(key: _keyUsuario);
  }
}