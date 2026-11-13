import { Response } from 'express';

// ERRORES: Un error "esperado" (ErrorHttp) lleva su código HTTP y su mensaje.
// responderError traduce también los errores de MySQL a mensajes entendibles
// (por ejemplo, el "Stock insuficiente" que lanzan los triggers de la BD).
export class ErrorHttp extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function responderError(res: Response, error: any, generico = 'Error de servidor'): void {
    if (error instanceof ErrorHttp) { res.status(error.status).json({ message: error.message }); return; }
    if (error?.sqlState === '45000') { res.status(409).json({ message: error.sqlMessage || error.message }); return; }
    if (error?.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Ya existe un registro con ese correo, código de barras o SKU' }); return;
    }
    if (error?.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
        res.status(400).json({ message: 'Valor fuera de rango (precio o stock negativo)' }); return;
    }
    if (error?.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({ message: 'Referencia inválida (la categoría, producto o usuario no existe)' }); return;
    }
    console.error(generico + ':', error);
    res.status(500).json({ message: generico });
}
