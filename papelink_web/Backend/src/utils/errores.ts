import { Request, Response, NextFunction } from 'express';

// Códigos por defecto cuando un error se lanza sin código propio
const CODIGO_POR_STATUS: Record<number, string> = {
    400: 'DATOS_INVALIDOS',
    401: 'NO_AUTORIZADO',
    403: 'SIN_PERMISO',
    404: 'NO_ENCONTRADO',
    409: 'CONFLICTO'
};

// Error "esperado": lleva el status HTTP, el mensaje para el usuario y un código
// corto que el front puede usar para saber exactamente qué falló.
export class ErrorHttp extends Error {
    status: number;
    codigo: string;
    constructor(status: number, message: string, codigo?: string) {
        super(message);
        this.status = status;
        this.codigo = codigo ?? CODIGO_POR_STATUS[status] ?? 'ERROR';
    }
}

// Mensajes claros para los índices únicos que crea papeleria.sql
const DUPLICADOS: Record<string, [string, string]> = {
    uq_usuarios_email: ['Ese correo ya está registrado', 'EMAIL_YA_REGISTRADO'],
    uq_productos_barras: ['Ya existe un producto con ese código de barras', 'CODIGO_BARRAS_DUPLICADO'],
    uq_productos_sku: ['Ya existe un producto con ese SKU', 'SKU_DUPLICADO'],
    uq_categorias_nombre: ['Ya existe una categoría con ese nombre', 'CATEGORIA_DUPLICADA'],
    uq_ventas_pedido: ['Ese apartado ya fue cobrado', 'PEDIDO_YA_COBRADO']
};

// Convierte un error de MySQL en un status + mensaje + código. Devuelve null si no lo reconoce.
export function traducirErrorMySQL(error: any): { status: number; message: string; codigo: string } | null {
    const sqlMessage: string = error?.sqlMessage ?? '';

    switch (error?.code) {
        case 'ECONNREFUSED':
            return { status: 503, codigo: 'BD_NO_DISPONIBLE', message: 'No se pudo conectar con MySQL. Revisa que esté encendido y que DB_HOST y DB_PORT del .env sean correctos.' };
        case 'ER_ACCESS_DENIED_ERROR':
        case 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR':
            return { status: 503, codigo: 'BD_CREDENCIALES', message: 'MySQL rechazó el usuario o la contraseña. Revisa DB_USER y DB_PASSWORD del .env.' };
        case 'ER_BAD_DB_ERROR':
            return { status: 503, codigo: 'BD_NO_EXISTE', message: 'La base de datos del .env no existe. Ejecuta papeleria.sql en MySQL.' };
        case 'ER_NO_SUCH_TABLE':
            return { status: 500, codigo: 'BD_TABLA_FALTANTE', message: 'Falta una tabla en la base de datos. Vuelve a ejecutar papeleria.sql.' };
        case 'PROTOCOL_CONNECTION_LOST':
        case 'ECONNRESET':
        case 'ETIMEDOUT':
        case 'ENOTFOUND':
            return { status: 503, codigo: 'BD_CONEXION_PERDIDA', message: 'Se perdió la conexión con MySQL. Intenta de nuevo.' };
        case 'ER_DUP_ENTRY': {
            const llave = Object.keys(DUPLICADOS).find((k) => sqlMessage.includes(k));
            const [message, codigo] = llave ? DUPLICADOS[llave] : ['Ya existe un registro con esos datos', 'DUPLICADO'];
            return { status: 409, message, codigo };
        }
        case 'ER_CHECK_CONSTRAINT_VIOLATED':
            if (sqlMessage.includes('ck_productos_precio')) return { status: 400, codigo: 'PRECIO_NEGATIVO', message: 'El precio no puede ser negativo' };
            if (sqlMessage.includes('ck_productos_stock')) return { status: 400, codigo: 'STOCK_NEGATIVO', message: 'El stock no puede ser negativo' };
            if (sqlMessage.includes('ck_dp_cantidad') || sqlMessage.includes('ck_dv_cantidad')) return { status: 400, codigo: 'CANTIDAD_INVALIDA', message: 'La cantidad debe ser mayor a cero' };
            return { status: 400, codigo: 'VALOR_FUERA_DE_RANGO', message: 'Uno de los valores está fuera del rango permitido' };
        case 'ER_NO_REFERENCED_ROW_2':
            return { status: 400, codigo: 'REFERENCIA_INVALIDA', message: 'La categoría, producto o usuario indicado no existe' };
        case 'ER_ROW_IS_REFERENCED_2':
            return { status: 409, codigo: 'TIENE_REGISTROS_RELACIONADOS', message: 'No se puede eliminar porque otros registros dependen de este' };
        case 'ER_DATA_TOO_LONG':
            return { status: 400, codigo: 'TEXTO_MUY_LARGO', message: 'Uno de los textos es demasiado largo' };
        case 'ER_BAD_NULL_ERROR':
            return { status: 400, codigo: 'DATO_FALTANTE', message: 'Falta un dato obligatorio' };
        case 'ER_TRUNCATED_WRONG_VALUE':
        case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
        case 'ER_WARN_DATA_OUT_OF_RANGE':
            return { status: 400, codigo: 'FORMATO_INVALIDO', message: 'Uno de los datos tiene un formato inválido' };
        case 'ER_LOCK_DEADLOCK':
        case 'ER_LOCK_WAIT_TIMEOUT':
            return { status: 409, codigo: 'BD_OCUPADA', message: 'Otro usuario está modificando lo mismo. Intenta de nuevo.' };
    }

    // Errores que lanzan a propósito los triggers y el procedimiento de la base (SIGNAL 45000)
    if (error?.sqlState === '45000') {
        const codigo = sqlMessage.includes('Stock insuficiente') ? 'STOCK_INSUFICIENTE' : 'REGLA_DE_NEGOCIO';
        return { status: 409, codigo, message: sqlMessage };
    }
    return null;
}

// Lo que usan todos los controladores en su catch. El tercer parámetro es el mensaje
// que se muestra si el error no se reconoce.
export function responderError(res: Response, error: any, generico = 'Error de servidor'): void {
    if (error instanceof ErrorHttp) {
        res.status(error.status).json({ message: error.message, codigo: error.codigo });
        return;
    }
    const traducido = traducirErrorMySQL(error);
    if (traducido) {
        if (traducido.status >= 500) console.error(`[${error.code}]`, error.sqlMessage ?? error.message);
        res.status(traducido.status).json({ message: traducido.message, codigo: traducido.codigo });
        return;
    }
    console.error(generico + ':', error);
    res.status(500).json({ message: generico, codigo: 'ERROR_INTERNO' });
}

// Se registran al final de index.ts: rutas que no existen y errores que nadie atrapó
export function rutaNoEncontrada(req: Request, res: Response): void {
    res.status(404).json({ message: `No existe la ruta ${req.method} ${req.path}`, codigo: 'RUTA_NO_ENCONTRADA' });
}

export function manejarErrores(error: any, req: Request, res: Response, next: NextFunction): void {
    if (error?.type === 'entity.parse.failed') {
        res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido', codigo: 'JSON_INVALIDO' });
        return;
    }
    if (error?.type === 'entity.too.large') {
        res.status(413).json({ message: 'La petición es demasiado grande', codigo: 'PETICION_MUY_GRANDE' });
        return;
    }
    responderError(res, error);
}