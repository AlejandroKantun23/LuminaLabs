import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { probarConexion } from './config/database';
import { rutaNoEncontrada, manejarErrores, traducirErrorMySQL } from './utils/errores';

import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import productoRoutes from './routes/productoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import ventaRoutes from './routes/ventaRoutes';
import reporteRoutes from './routes/reporteRoutes';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        // carpeta donde se guardan las imágenes de los productos
        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    }

    routes(): void {
        this.app.get('/api/health', (req, res) => { res.json({ ok: true }); });
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/usuarios', usuarioRoutes);
        this.app.use('/api/categorias', categoriaRoutes);
        this.app.use('/api/productos', productoRoutes);
        this.app.use('/api/pedidos', pedidoRoutes);
        this.app.use('/api/ventas', ventaRoutes);
        this.app.use('/api/reportes', reporteRoutes);

        // siempre al final: rutas que no existen y errores que nadie atrapó
        this.app.use(rutaNoEncontrada);
        this.app.use(manejarErrores);
    }

    async start(): Promise<void> {
        try {
            await probarConexion();
        } catch (error) {
            const motivo = traducirErrorMySQL(error)?.message ?? error;
            console.error('No se pudo iniciar: MySQL no respondió.', motivo);
            process.exit(1);
        }

        const port = Number(this.app.get('port'));
        this.app.listen(port, '0.0.0.0', () => {
            console.log(`Backend de Papelink corriendo en http://localhost:${port}`);
        });
    }
}

new Server().start();