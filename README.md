# Papelink
Sistema dual de gestión para papelería (Panel web de administración/POS y App móvil para clientes) desarrollado por el equipo **Luminalabs** para la Universidad Tecnológica de Cancún.

## Equipo
-Arizmendi Reyes Ángel de Jesús  
-Loria Gil Carlos Said  
-Kantún Mukul José Alejandro  
-Peraza Cupul Luis Ángel

## 1. Problema Identificado
La papelería opera de forma manual con libretas y bitácoras físicas. Esto provoca falta de control en el stock, mermas por productos agotados y tiempos muertos atendiendo consultas de precios y existencias por mensajes. **Papelink** automatiza el inventario, permite a los clientes apartar productos desde el celular y ayuda al cajero a gestionar ventas rápidas.

## 2. Flujo Seleccionado y Mapa de Navegación
El proceso se divide en 4 caminos interconectados entre la app y la web:
* **Camino A:** Acceso y sesiones de usuario.
* **Camino B:** Consulta de catálogo móvil y apartado de productos por parte del cliente.
* **Camino C:** Venta en mostrador y atención de reservas por el cajero.
* **Camino D:** Control de inventario y alertas automáticas de stock bajo.

## 3. Lista de Interfaces
* **Aplicación Web (Administración):**
  * Pantalla de carga y Inicio de sesión.
  * Dashboard / Inicio (Indicadores, métricas y últimas ventas).
  * Inventario (Catálogo, filtros y alertas de stock).
  * Ventas (Historial con filtros por fecha) y Registrar venta (POS/Cobro).
  * Pedidos (Gestión de apartados móviles).
* **Aplicación Móvil (Cliente):**
  * Catálogo de productos, buscador y estados de disponibilidad.
  * Modal de selección de cantidad y Carrito de compras.
  * Confirmación de apartado de pedido.

## 4. Bocetos y Prototipo
* **Bocetos de diseño:** Disponibles en la carpeta "docs/mockups/" del proyecto.
* **Evidencia del prototipo frontend:** Interfaces maquetadas e interactivas corriendo con datos ficticios en React y Flutter.

## 5. Tecnologías
* **Frontend Web:** React, TypeScript, Vite, Tailwind CSS, React Router.
* **Móvil:** Flutter (Dart).
* **Control de versiones:** Git / GitHub.

## 6. Estructura del Proyecto
```text
frontend/  
├── src/  
│   ├── assets/          # Recursos gráficos e imágenes  
│   ├── components/      # Componentes reutilizables (Botones, Modales, Tablas)  
│   ├── context/         # Estados globales (Auth y Carrito)  
│   ├── pages/           # Vistas (Dashboard, Inventario, Ventas, Pedidos)  
│   ├── services/        # Capa de datos ficticios (simulación de API)  
│   ├── types/           # Interfaces TypeScript (Product, Sale, Order)  
│   └── App.tsx          # Enrutador principal  
├── tailwind.config.js   # Configuración de estilos  
└── package.json
```
# 1. Clonar el repositorio
git clone [https://github.com/AlejandroKantun23/LuminaLabs.git](https://github.com/AlejandroKantun23/LuminaLabs.git)  
cd LuminaLabs  

# 2. Ejecutar la Aplicación Web (Frontend)
cd frontend  
npm install  
npm run dev   - Abre en http://localhost:5173

# 3. Ejecutar la Aplicación Móvil (Flutter)  
cd ../papelink_mobile  
flutter pub get  
flutter run
