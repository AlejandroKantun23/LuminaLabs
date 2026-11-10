import 'package:frontend/models/usuario.dart';

class UsuarioService {
  // ponemos los clientes que ya existentes desde el inicio (para pruebas)
  static final List<Usuario> _usuarios = [
    Usuario(nombre: 'Carlos', correo: 'carlos@correo.com', password: 'Carlos#1'),
    Usuario(nombre: 'María', correo: 'maria@correo.com', password: 'Maria\$2'),
  ];

  // Agrega un usuario, devuelve false si el usuario ya existe
  static bool registrar(Usuario nuevo) {
    final existe = _usuarios.any((u) => u.correo == nuevo.correo);
    if (existe) return false;
    _usuarios.add(nuevo);
    return true;
  }

  // Devuelve el usuario si correo y contraseña coinciden, si no null
  static Usuario? iniciarSesion(String correo, String password) {
    for (final u in _usuarios) {
      if (u.correo == correo && u.password == password) return u;
    }
    return null;
  }

  // Revisa si el correo está registrado
  static bool existeCorreo(String correo) {
    return _usuarios.any((u) => u.correo == correo);
  }

  // Cambia la contraseña (false si no existe o es igual a la actual)
  static bool cambiarPassword(String correo, String nueva) {
    final i = _usuarios.indexWhere((u) => u.correo == correo);
    if (i == -1) return false;

    final actual = _usuarios[i];
    if (actual.password == nueva) return false;

    _usuarios[i] = Usuario(
      nombre: actual.nombre,
      correo: actual.correo,
      password: nueva,
    );
    return true;
  }
}