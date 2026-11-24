import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/producto.dart';

class ProductoException implements Exception {
  const ProductoException(this.mensaje);
  final String mensaje;

  @override
  String toString() => mensaje;
}

class ProductoService {
  static Future<List<Producto>> listarProductos() async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/productos');

    try {
      final response = await http
          .get(uri, headers: {'Accept': 'application/json'})
          .timeout(ApiConfig.timeout);

      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw ProductoException(
          'Error al obtener productos (${response.statusCode}).',
        );
      }

      final decoded = jsonDecode(response.body);
      final List<dynamic> rawList;

      if (decoded is List) {
        rawList = decoded;
      } else if (decoded is Map<String, dynamic>) {
        if (decoded['productos'] is List) {
          rawList = decoded['productos'] as List<dynamic>;
        } else if (decoded['data'] is List) {
          rawList = decoded['data'] as List<dynamic>;
        } else {
          throw const ProductoException(
            'Formato de respuesta de productos no reconocido.',
          );
        }
      } else {
        throw const ProductoException(
          'Formato de respuesta de productos inválido.',
        );
      }

      final productos = rawList
          .whereType<Map<String, dynamic>>()
          .map(Producto.fromJson)
          .where((p) => p.activo)
          .toList();

      Producto.establecerCatalogo(productos);
      return productos;
    } on TimeoutException {
      throw const ProductoException(
        'El servidor tardó demasiado en responder al cargar productos.',
      );
    } on ProductoException {
      rethrow;
    } catch (e) {
      throw ProductoException('No se pudieron cargar los productos: $e');
    }
  }
}