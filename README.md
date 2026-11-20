# Micro-ERP Moda: Módulo de Inventario y Almacén

Proyecto Final de Investigación y Desarrollo de un Micro-ERP modular inspirado en **Odoo** y conectado en tiempo real con datos de la industria textil y de moda del simulador empresarial **Sim Companies**.

## Tecnologías Utilizadas
* **Backend:** Node.js + Express.js
* **Base de Datos:** SQLite3 (`inventario.db`)
* **Integración de Datos:** Axios + API pública de Sim Companies (`v3/market`)
* **Frontend:** HTML5, CSS3 y JavaScript (Fetch API)

## Estructura del Proyecto
* `src/models/database.js`: Conexión a SQLite y creación de tablas (`productos` y `movimientos`).
* `src/controllers/inventarioController.js`: Lógica CRUD y cálculo automático de stock.
* `src/routes/inventarioRoutes.js`: Endpoints RESTful (`/api/productos` y `/api/movimientos`).
* `public/`: Interfaz web (Dashboard interactivo).
* `seed.js`: Script de carga inicial desde Sim Companies.

## Instalación y Ejecución
1. Instalar dependencias:
   ```bash
   npm install