import 'dart:math';

class CodigoService {
  // Códigos de ejemplo (simulan los que llegarían por correo)
  static const List<String> _codigos = ['1957', '4821', '7305', '2468', '9134'];

  static String? _codigoActual;

  // Elige un código al azar y lo guarda
  static String generar() {
    _codigoActual = _codigos[Random().nextInt(_codigos.length)];
    return _codigoActual!;
  }

  // Revisa si el código escrito es el que se generó
  static bool validar(String codigo) {
    return _codigoActual != null && codigo == _codigoActual;
  }

  static void limpiar() {
    _codigoActual = null;
  }
}