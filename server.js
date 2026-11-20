const express = require('express');
const cors = require('cors');
const path = require('path');
const inventarioRoutes = require('./src/routes/inventarioRoutes');

const app = express();
const PORT = 3000;

// Middlewares (permisos y lectura de datos JSON)
app.use(cors());
app.use(express.json());

// Servir los archivos de la interfaz web (carpeta public)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar las rutas de nuestra API de Inventario
app.use('/api', inventarioRoutes);

// Encender el servidor
app.listen(PORT, () => {
    console.log(` Servidor Micro-ERP Moda corriendo en: http://localhost:${PORT}`);
    console.log(` Ver datos en vivo: http://localhost:${PORT}/api/productos`);
});