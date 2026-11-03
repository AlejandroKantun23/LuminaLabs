import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';

// Importación de las colecciones de rutas del backend
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import productoRoutes from './routes/productoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import ventaRoutes from './routes/ventaRoutes';
import reporteRoutes from './routes/reporteRoutes';

class Server {
    public app: Application;

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

        // MULTIMEDIA: Carpeta física donde se guardan las imágenes de los productos
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
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Backend de Papelink corriendo en http://localhost:${this.app.get('port')} 🚀`);
        });
    }
}

const server = new Server();
server.start();
