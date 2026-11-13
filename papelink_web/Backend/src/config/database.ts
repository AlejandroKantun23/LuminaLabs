
import mysql from 'mysql2/promise';

// CONEXIÓN A LA BASE DE DATOS: Configura un "Pool" de conexiones hacia MySQL
// (cada petición HTTP toma una conexión libre del pool y la devuelve al terminar).
// Es la misma forma de conectar que usas en EduVi: valores directos, sin .env.
// Cambia estos 5 valores por los de tu MySQL (HeidiSQL) y listo.
export const pool = mysql.createPool({
    host: 'localhost',              // Tu servidor local
    port: 3307,                     // Puerto de tu MySQL (3306 es el normal, tú usas 3307)
    user: 'root',                   // Tu usuario de HeidiSQL
    password: 'root',      // Tu contraseña de HeidiSQL (vacío si no tiene)
    database: 'papeleria',          // La BD que crea database/papeleria.sql
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true            // Los DECIMAL (precios) llegan como número, no como texto
});

// TRANSACCIÓN: Ejecuta varios pasos como uno solo. Si algo falla se hace
// ROLLBACK y no se guarda nada a medias (ej. un pedido sin sus artículos).
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
