# Papelink - Móvil

Apartado donde se maneja la versión móvil de Papelink

En esta aplicación se quiere manejar una tienda virtual que se controla mediante pedidos de artículos disponibles en la papelería, así poder ir directamente a comprar sin necesidad de una fila, aunque solo maneja pagos directos en físico (solo en la papelería).
```
papelink_movil/
├── frontend/                
│   └── lib/
│       ├── config/          Api para la conexión a la BDD
│       ├── models/          Usuario, Producto como modelos
│       ├── screens/         cart, contactos, home, login, newpass, profile, register, settings y splash
│       ├── services/        manejo de funciones para el carrito, login y vista de los productos, ademas del codigo de verificación
│       └── widgets/         pequeñas secciones para reutilizar a lo largo e las distintas pantallas
```
## Conexión a BDD
| host | port | user | password | database |
|---|---|---|---|---|
| localhost | 3307 | root | (la de tu HeidiSQL) | papeleria |
