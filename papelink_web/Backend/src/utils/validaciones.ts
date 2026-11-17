import { ErrorHttp } from './errores';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO = /^[0-9+\s-]{7,20}$/;

// Cada función revisa un dato, lanza el error exacto si algo está mal
// y devuelve el valor ya limpio para guardarlo.
export function validarNombre(valor: unknown): string {
    if (typeof valor !== 'string' || !valor.trim()) throw new ErrorHttp(400, 'El nombre es obligatorio', 'NOMBRE_REQUERIDO');
    if (valor.trim().length > 100) throw new ErrorHttp(400, 'El nombre no puede pasar de 100 caracteres', 'NOMBRE_LARGO');
    return valor.trim();
}

export function validarEmail(valor: unknown): string {
    if (typeof valor !== 'string' || !valor.trim()) throw new ErrorHttp(400, 'El correo es obligatorio', 'EMAIL_REQUERIDO');
    const email = valor.trim().toLowerCase();
    if (!EMAIL.test(email)) throw new ErrorHttp(400, 'El correo no tiene un formato válido (ejemplo: nombre@correo.com)', 'EMAIL_INVALIDO');
    if (email.length > 150) throw new ErrorHttp(400, 'El correo no puede pasar de 150 caracteres', 'EMAIL_LARGO');
    return email;
}

export function validarPassword(valor: unknown): string {
    if (typeof valor !== 'string' || valor === '') throw new ErrorHttp(400, 'La contraseña es obligatoria', 'PASSWORD_REQUERIDA');
    if (valor.length < 8) throw new ErrorHttp(400, 'La contraseña debe tener al menos 8 caracteres', 'PASSWORD_CORTA');
    return valor;
}

// El teléfono es opcional: si no viene se guarda NULL
export function validarTelefono(valor: unknown): string | null {
    if (valor === undefined || valor === null || valor === '') return null;
    if (typeof valor !== 'string' || !TELEFONO.test(valor.trim())) throw new ErrorHttp(400, 'El teléfono no es válido', 'TELEFONO_INVALIDO');
    return valor.trim();
}