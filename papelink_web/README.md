# Papelink

Sistema para papelería: app móvil (clientes) + panel web / POS (empleados y dueño).

```
papelink/
├── frontend/                React + Vite + Tailwind (tu proyecto LuminaLabs)
│   └── src/api/client.ts    funciones para llamar a la API
├── backend/                 Node + Express + TypeScript + MySQL
│   ├── uploads/             imágenes de productos
│   └── src/
│       ├── index.ts         servidor (clase Server)
│       ├── config/          database.ts (conexión a MySQL), seguridad.ts (secreto JWT)
│       ├── models/          Usuario, Categoria, Producto, Pedido, Venta
│       ├── controllers/     Auth, Usuario, Categoria, Producto, Pedido, Venta, Reporte
│       ├── routes/          una por controlador
│       ├── middleware/      auth.ts (token + roles)
│       └── utils/           errores.ts, lineas.ts (precios y total)
└── database/
    └── papeleria.sql        tablas, triggers, procedimiento, evento, vistas, datos de ejemplo
```

## Conexión a MySQL

Está en `backend/src/config/database.ts`, con los valores directos como en EduVi:

| host | port | user | password | database |
|---|---|---|---|---|
| localhost | 3307 | root | (la de tu HeidiSQL) | papeleria |

Cambia ahí lo que sea distinto en tu equipo.

## Puesta en marcha

1. Abre MySQL en HeidiSQL, abre `database/papeleria.sql` y ejecútalo completo (F9). Crea la base `papeleria`.
   Para la cancelación automática de apartados vencidos: `SET GLOBAL event_scheduler = ON;`
2. Backend: `cd backend` → `npm install` → `npm run dev` (http://localhost:3000/api/health)
3. Frontend: `cd frontend` → `npm install` → `npm run dev` (http://localhost:5173, `/api` se redirige al backend)
4. Usuarios de ejemplo (todos con contraseña `12345`, solo para pruebas):
   - Admin: `admin@papeleria.com`
   - Empleado: `empleado@papeleria.com`
   - Cliente: `carlos@correo.com`

   Cámbialas antes de usar el sistema en la tienda.

## Endpoints

Rol: 🌐 público · 👤 cliente · 🧾 empleado/admin · 🔑 admin

| Método | Ruta | Rol | Qué hace |
|---|---|---|---|
| POST | /api/auth/register | 🌐 | Registro de cliente (teléfono opcional) |
| POST | /api/auth/login | 🌐 | Login → `{ token, user }` |
| GET | /api/auth/me | sesión | Usuario actual |
| GET | /api/categorias | 🌐 | Lista de categorías |
| POST/PUT/DELETE | /api/categorias[/:id] | 🔑 | Alta, edición, baja |
| GET | /api/productos?categoria=&q= | 🌐 | Catálogo con stock (app móvil) |
| GET | /api/productos/:id | 🌐 | Detalle |
| GET | /api/productos/inventario | 🧾 | Inventario con estatus (Disponible / Stock bajo / Sin existencias) |
| GET | /api/productos/codigo/:codigo | 🧾 | Búsqueda por código de barras o SKU |
| POST/PUT | /api/productos[/:id] | 🧾 | Alta y edición |
| PATCH | /api/productos/:id/stock | 🧾 | `{ stock }` o `{ delta }` |
| DELETE | /api/productos/:id | 🔑 | Baja lógica |
| POST | /api/pedidos | 👤 | Apartar `{ items: [{ producto_id, cantidad }] }` |
| GET | /api/pedidos/mis | 👤 | Mis apartados |
| PATCH | /api/pedidos/:id/cancelar | 👤 | Cancelar (pendiente o confirmado) |
| GET | /api/pedidos?estado= | 🧾 | Apartados de todos |
| GET | /api/pedidos/:id | dueño / 🧾 | Detalle con artículos |
| PATCH | /api/pedidos/:id/estado | 🧾 | Confirmar → listo en tienda / cancelar |
| POST | /api/pedidos/:id/cobrar | 🧾 | Cobra y entrega `{ metodo_pago }` |
| POST | /api/ventas | 🧾 | Venta de mostrador `{ metodo_pago, items }` |
| GET | /api/ventas?desde=&hasta= | 🧾 | Historial |
| GET | /api/ventas/:id | 🧾 | Detalle de venta |
| GET | /api/reportes/resumen-dia | 🧾 | Tarjetas del panel |
| GET/POST | /api/usuarios | 🔑 | Alta de empleados |
| PATCH | /api/usuarios/:id/activo | 🔑 | Activar / desactivar |

## Integración del panel web
- El frontend autentica al personal contra `/api/auth/login` y envía el token Bearer en las llamadas protegidas.
- POS, inventario, ventas, pedidos y tarjetas del panel leen y actualizan los datos de MySQL a través de la API.
- El importe y el inventario definitivos siempre los valida y calcula el backend; no se usan datos de demostración para registrar ventas.

## Reglas importantes
- Precio y total los calcula el backend desde la BD; el cliente solo manda producto y cantidad.
- El stock se aparta al crear el pedido, se devuelve al cancelarlo y se descuenta en ventas directas (triggers). Si no alcanza responde 409.
- El rol `cliente` solo se asigna en el registro; empleados y admins los da de alta un admin.
- Los errores siempre responden `{ "message": "..." }`.
