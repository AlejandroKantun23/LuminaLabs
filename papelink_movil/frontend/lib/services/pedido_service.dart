import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/pedido.dart';
import 'session_service.dart';

class PedidoException implements Exception {
  final String mensaje;
  final bool sesionExpirada; // true si hay que volver a iniciar sesión

  const PedidoException(this.mensaje, {this.sesionExpirada = false});

  @override
  String toString() => mensaje;
}

class PedidoService {
  // GET /pedidos/mis -> los apartados del cliente con sesión iniciada
  static Future<List<Pedido>> listarMisPedidos() async {
    final data = await _enviar('GET', '/pedidos/mis');
    if (data is! List) {
      throw const PedidoException('El servidor devolvió un formato inesperado.');
    }
    return data.whereType<Map<String, dynamic>>().map(Pedido.fromJson).toList();
  }

  // GET /pedidos/:id -> un apartado con sus artículos
  static Future<Pedido> obtenerPedido(int id) async {
    final data = await _enviar('GET', '/pedidos/$id');
    if (data is! Map<String, dynamic>) {
      throw const PedidoException('El servidor devolvió un formato inesperado.');
    }
    return Pedido.fromJson(data);
  }

  // PATCH /pedidos/:id/cancelar -> el cliente cancela su apartado
  static Future<void> cancelarPedido(int id) async {
    await _enviar('PATCH', '/pedidos/$id/cancelar');
  }

  static Future<dynamic> _enviar(String metodo, String ruta) async {
    final token = await SessionService.obtenerToken();
    if (token == null || token.isEmpty) {
      throw const PedidoException(
        'Inicia sesión para ver tus pedidos.',
        sesionExpirada: true,
      );
    }

    final uri = Uri.parse('${ApiConfig.baseUrl}$ruta');
    final headers = {
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };

    try {
      final http.Response response;
      if (metodo == 'PATCH') {
        response =
            await http.patch(uri, headers: headers).timeout(ApiConfig.timeout);
      } else {
        response =
            await http.get(uri, headers: headers).timeout(ApiConfig.timeout);
      }

      final dynamic body =
          response.body.isNotEmpty ? jsonDecode(response.body) : null;

      if (response.statusCode >= 200 && response.statusCode < 300) return body;

      final mensajeBackend = body is Map<String, dynamic>
          ? (body['message'] ?? body['error'])?.toString()
          : null;

      if (response.statusCode == 401) {
        await SessionService.cerrarSesion();
        throw PedidoException(
          mensajeBackend ?? 'Tu sesión expiró, vuelve a iniciar sesión.',
          sesionExpirada: true,
        );
      }

      if (response.statusCode >= 400 && response.statusCode < 500) {
        throw PedidoException(
          mensajeBackend ?? 'No se pudo completar la acción.',
        );
      }

      throw PedidoException(
        'Error del servidor (${response.statusCode}). Intenta más tarde.',
      );
    } on PedidoException {
      rethrow;
    } on SocketException {
      throw const PedidoException(
        'No se pudo conectar con el servidor. Verifica que el backend esté activo.',
      );
    } on TimeoutException {
      throw const PedidoException(
        'El servidor tardó demasiado en responder. Intenta de nuevo.',
      );
    } on FormatException {
      throw const PedidoException('El servidor devolvió un formato inesperado.');
    }
  }
}