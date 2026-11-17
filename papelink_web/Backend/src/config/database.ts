import 'dotenv/config';
import mysql from 'mysql2/promise';

// Si falta algo en el .env se avisa de una vez, antes de intentar conectar
const requeridas = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME'];
const faltantes = requeridas.filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
    console.error(`Faltan estas variables en el archivo .env: ${faltantes.join(', ')}`);
    process.exit(1);
}

// Pool de conexiones: cada petición toma una conexión libre y la devuelve al terminar
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true // los DECIMAL (precios) llegan como número y no como texto
});

// Se usa al arrancar el servidor para saber si MySQL responde
export async function probarConexion(): Promise<void> {
    const conn = await pool.getConnection();
    try {
        await conn.ping();
        console.log(`Conexión con MySQL lista (base de datos: ${process.env.DB_NAME})`);
    } finally {
        conn.release();
    }
}

// Ejecuta varios pasos como uno solo; si algo falla se deshace todo (ROLLBACK)
export async function conTransaccion<T>(paso: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const resultado = await paso(conn);
        await conn.commit();
        return resultado;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}