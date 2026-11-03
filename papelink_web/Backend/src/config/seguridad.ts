// ============================================================================
// SEGURIDAD: Secreto con el que se firman los tokens de sesión (JWT).
// Cambia el texto por uno largo y propio antes de usar el sistema en la tienda.
// ============================================================================
export const JWT_SECRET = process.env.JWT_SECRET || 'papelink_cambia_este_secreto_por_uno_largo_y_unico';
export const JWT_EXPIRA = '8h'; // La sesión dura una jornada de trabajo
