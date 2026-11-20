const axios = require('axios');
const db = require('./src/models/database');

// IDs reales de Sim Companies para tu empresa de moda:
// 40: Algodón, 41: Tela, 46: Cuero, 60: Vestidos, 62: Bolsas
const articulosModa = [
    { id: 40, nombre: 'Algodón (Materia Prima)', categoria: 'Insumo', stock: 600, costo: 2.00, precioRef: 2.35 },
    { id: 41, nombre: 'Tela (Insumo)', categoria: 'Insumo', stock: 486, costo: 5.00, precioRef: 4.50 },
    { id: 46, nombre: 'Cuero (Materia Prima)', categoria: 'Insumo', stock: 52, costo: 29.00, precioRef: 28.50 },
    { id: 60, nombre: 'Vestidos', categoria: 'Producto Terminado', stock: 450, costo: 22.50, precioRef: 26.50 },
    { id: 62, nombre: 'Bolsas de Mano', categoria: 'Producto Terminado', stock: 150, costo: 47.00, precioRef: 47.50 }
];

async function cargarDatosSimCompanies() {
    console.log("Conectando con Sim Companies para obtener precios reales...");

    for (let item of articulosModa) {
        let precioFinal = item.precioRef;
        let origen = "Enciclopedia Sim Companies (Respaldo)";

        try {
            // Intentamos consultar la API v3 de Sim Companies simulando un navegador
            const respuesta = await axios.get(`https://www.simcompanies.com/api/v3/market/0/${item.id}/`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            
            if (respuesta.data && respuesta.data.length > 0) {
                precioFinal = respuesta.data[0].price;
                origen = "API en vivo Sim Companies";
            }
        } catch (error) {
            // Si la API bloquea o cambia de ruta, usamos el precio real de referencia sin detener el programa
        }

        // Guardamos en nuestra base de datos SQLite
        db.run(
            `INSERT OR REPLACE INTO productos (id, nombre, categoria, stock_actual, costo_unitario, precio_mercado) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [item.id, item.nombre, item.categoria, item.stock, item.costo, precioFinal],
            (err) => {
                if (err) {
                    console.error(`Error guardando ${item.nombre}:`, err.message);
                } else {
                    console.log(`Guardado: ${item.nombre} | Stock: ${item.stock} | Precio: $${precioFinal} (${origen})`);
                }
            }
        );
    }
}

cargarDatosSimCompanies();