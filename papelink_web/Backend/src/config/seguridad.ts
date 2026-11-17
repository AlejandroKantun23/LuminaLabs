import 'dotenv/config';

// El secreto con el que se firman los tokens ya no se escribe en el código
const secreto = process.env.JWT_SECRET;
if (!secreto || secreto.length < 32) {
    console.error('Falta JWT_SECRET en el .env (debe tener mínimo 32 caracteres).');
    console.error('Genera uno con: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
    process.exit(1);
}

export const JWT_SECRET: string = secreto;
export const JWT_EXPIRA = process.env.JWT_EXPIRA || '8h';