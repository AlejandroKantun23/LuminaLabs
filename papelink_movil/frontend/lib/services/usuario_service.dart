import 'package:frontend/models/usuario.dart';

class UsuarioService {
  // ponemos los clientes que ya existentes desde el inicio (para pruebas)
  static final List<Usuario> _usuarios = [
    Usuario(nombre: 'Carlos', correo: 'carlos@correo.com', password: 'Carlos#1'),
    Usuario(nombre: 'María', correo: 'maria@correo.com', password: 'Maria\$2'),
  ];

  // Agrega un usuario este se pone en false si es que el usuario ya existe 
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
}