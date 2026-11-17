import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface UsuarioLogin extends RowDataPacket {
    id: number;
    nombre: string;
    email: string;
    telefono: string | null;
    rol: 'cliente' | 'empleado' | 'admin';
    activo: number;
    password_ok: number; // 1 si la contraseña coincide, 0 si no
}

// MySQL calcula SHA2(contraseña, 256) y compara; la contraseña nunca se guarda en texto plano
export async function buscarParaLogin(email: string, password: string): Promise<UsuarioLogin | null> {
    const [filas] = await pool.query<UsuarioLogin[]>(
        `SELECT id, nombre, email, telefono, rol, activo, (password = SHA2(?, 256)) AS password_ok
           FROM usuarios WHERE email = ?`,
        [password, email]
    );
    return filas[0] ?? null;
}

export async function buscarPorId(id: number): Promise<UsuarioLogin | null> {
    const [filas] = await pool.query<UsuarioLogin[]>(
        'SELECT id, nombre, email, telefono, rol, activo, 1 AS password_ok FROM usuarios WHERE id = ?',
        [id]
    );
    return filas[0] ?? null;
}

export async function emailExiste(email: string): Promise<boolean> {
    const [filas] = await pool.query<RowDataPacket[]>('SELECT id FROM usuarios WHERE email = ?', [email]);
    return filas.length > 0;
}

export async function crearUsuario(datos: {
    nombre: string; email: string; password: string; telefono: string | null; rol: string;
}): Promise<number> {
    const [resultado] = await pool.query<ResultSetHeader>(
        'INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, SHA2(?, 256), ?, ?)',
        [datos.nombre, datos.email, datos.password, datos.telefono, datos.rol]
    );
    return resultado.insertId;
}