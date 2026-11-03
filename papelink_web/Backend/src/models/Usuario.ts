// ============================================================================
// MODELO DE USUARIO: Cliente (app móvil), empleado o admin (panel web).
// Nunca incluye el password: así no puede salir por accidente en una respuesta.
// ============================================================================
export class Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono: string | null; // Opcional: no se pide al registrarse
    rol: 'cliente' | 'empleado' | 'admin';

    // Se arma directo desde una fila de MySQL: new Usuario(fila)
    constructor(fila: any) {
        this.id = fila.id;
        this.nombre = fila.nombre;
        this.email = fila.email;
        this.telefono = fila.telefono ?? null;
        this.rol = fila.rol;
    }
}
