# Papelink — Panel Web y POS

Sistema para papelería: app móvil (clientes) + panel web / POS (empleados y dueño). Este apartado documenta el módulo web, construido con React, Express (TypeScript) y MySQL.

---

## Integrantes y Aportaciones

* **Arizmendi Reyes Ángel de Jesús:** Apoyo en estructura de vistas, componentes de interfaz y revisión de flujos entre frontend y backend.
* **Kantún Mukul José Alejandro:** Ejecución, pruebas y validación integral de la sección web y apoyo en navegación/pantallas.
* **Loria Gil Carlos Said:** Apoyo en configuración del entorno, revisión de endpoints/contratos de API y pruebas de integración.
* **Peraza Cupul Luis Ángel:** Desarrollo y seguimiento de la aplicación móvil y coordinación de funcionalidades del sistema.

---

## Estructura del Proyecto

```text
papelink_web/
├── frontend/               # React + Vite + Tailwind (panel web / POS)[cite: 43]
│   └── src/
│       └── api/client.ts   # Funciones para llamar a la API[cite: 43]
├── backend/                # Node + Express + TypeScript + MySQL[cite: 43]
│   ├── uploads/            # Imágenes de productos[cite: 43]
│   └── src/
│       ├── index.ts        # Servidor Express y montaje de rutas[cite: 43]
│       ├── config/         # database.ts (conexión a MySQL), seguridad.ts (JWT)[cite: 43]
│       ├── models/         # Usuario, Categoria, Producto, Pedido, Venta[cite: 43]
│       ├── controllers/    # Auth, Usuario, Categoria, Producto, Pedido, Venta, Reporte[cite: 43]
│       ├── repositories/   # Capa de acceso a datos (UsuarioRepository.ts)
│       ├── routes/         # Una ruta por controlador[cite: 43]
│       ├── middleware/     # auth.ts (token + roles)[cite: 43]
│       └── utils/          # errores.ts, lineas.ts (precios y total), validaciones.ts[cite: 43]
└── database/
    └── papeleria.sql       # Tablas, triggers, procedimiento, evento, vistas y datos de ejemplo[cite: 43]

## Conexión a MySQL

El archivo MySQL se ubica en: `backend/src/config/database.ts`

| host | port | user | password | database |
|---|---|---|---|---|
| localhost | 3307 | root | (la de tu HeidiSQL) | papeleria |

## Puesta en marcha

1-Base de datos: Abre MySQL en HeidiSQL, abre database/papeleria.sql y ejecútalo completo (F9) para crear la base papeleria. Para la cancelación automática de apartados vencidos, puedes activar SET GLOBAL event_scheduler = ON;.
2-Backend: cd backend → npm install → npm run dev (corre en http://localhost:3000, endpoint de salud en http://localhost:3000/api/health).
3-Frontend: cd frontend → npm install → npm run dev (corre en http://localhost:5173, comunicándose con el backend vía /api).
4-Usuarios de ejemplo (todos con contraseña 12345, solo para pruebas):   Admin: admin@papeleria.com   Empleado: empleado@papeleria.com   Cliente: carlos@correo.com
*Cámbialas antes de usar el sistema en la tienda*   

## Integración del panel web
-El frontend autentica al personal contra /api/auth/login y envía el token Bearer en las llamadas protegidas.
-POS, inventario, ventas, pedidos y tarjetas del panel leen y actualizan los datos de MySQL a través de la API.
-El importe y el inventario definitivos siempre los valida y calcula el backend; no se usan datos de demostración para registrar ventas.

## Reglas importantes
-Precio y total los calcula el backend desde la BD; el cliente solo manda producto y cantidad.
-El stock se aparta al crear el pedido, se devuelve al cancelarlo y se descuenta en ventas directas. Si no alcanza responde 409.
-El rol `cliente` solo se asigna en el registro; empleados y admins los da de alta un admin.
-Los errores siempre responden { "message": "..." } (502 si el proxy/servidor no responde).
