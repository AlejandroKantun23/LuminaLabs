class Usuario {
  final int id;
  final String nombre;
  final String email;
  final String? telefono;
  final String rol;

  const Usuario({
    required this.id,
    required this.nombre,
    required this.email,
    this.telefono,
    required this.rol,
  });

  // Alias por si alguna otra pantalla existente de tu app usa usuario.correo
  String get correo => email;

  factory Usuario.fromJson(Map<String, dynamic> json) {
    final dynamic rawId = json['id'] ?? 0;
    return Usuario(
      id: rawId is int ? rawId : int.tryParse(rawId.toString()) ?? 0,
      nombre: (json['nombre'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      telefono: json['telefono']?.toString(),
      rol: (json['rol'] ?? 'cliente').toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'nombre': nombre,
        'email': email,
        'telefono': telefono,
        'rol': rol,
      };
}