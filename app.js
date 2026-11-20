const API_URL = '/api';

// Cargar todo al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    cargarInventario();
    cargarMovimientos();
});

// 1. Obtener productos y actualizar tarjetas + tabla + select
async function cargarInventario() {
    const res = await fetch(`${API_URL}/productos`);
    const productos = await res.json();

    const tbody = document.getElementById('tabla-productos');
    const select = document.getElementById('mov-producto');
    tbody.innerHTML = '';
    select.innerHTML = '';

    let valorTotal = 0;
    let alertas = 0;

    productos.forEach(p => {
        valorTotal += p.stock_actual * p.costo_unitario;
        const stockBajo = p.stock_actual < 60;
        if (stockBajo) alertas++;

        const margen = (p.precio_mercado - p.costo_unitario).toFixed(2);
        const colorMargen = margen >= 0 ? 'green' : 'red';

        // Llenar selector de movimientos
        select.innerHTML += `<option value="${p.id}">${p.nombre} (Stock: ${p.stock_actual})</option>`;

        // Llenar fila de tabla
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.categoria}</td>
                <td><strong>${p.stock_actual}</strong> u.</td>
                <td>$${p.costo_unitario.toFixed(2)}</td>
                <td>$${p.precio_mercado.toFixed(2)}</td>
                <td style="color:${colorMargen}; font-weight:bold;">$${margen}</td>
                <td>${stockBajo ? '<span class="badge-bajo">⚠️ Stock Bajo</span>' : '<span class="badge-ok">✔ Óptimo</span>'}</td>
                <td>
                    <button class="btn-edit" onclick="editarPrecio(${p.id}, '${p.nombre}', '${p.categoria}', ${p.costo_unitario}, ${p.precio_mercado})">Editar</button>
                    <button class="btn-delete" onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('valor-almacen').textContent = `$${valorTotal.toFixed(2)}`;
    document.getElementById('total-articulos').textContent = productos.length;
    document.getElementById('alertas-stock').textContent = alertas;
}

// 2. Obtener historial de movimientos
async function cargarMovimientos() {
    const res = await fetch(`${API_URL}/movimientos`);
    const movimientos = await res.json();
    const tbody = document.getElementById('tabla-movimientos');
    tbody.innerHTML = '';

    movimientos.forEach(m => {
        const claseTipo = m.tipo === 'ENTRADA' ? 'tipo-entrada' : 'tipo-salida';
        tbody.innerHTML += `
            <tr>
                <td>${m.fecha}</td>
                <td>${m.producto}</td>
                <td class="${claseTipo}">${m.tipo}</td>
                <td>${m.cantidad} u.</td>
                <td>${m.motivo}</td>
            </tr>
        `;
    });
}

// 3. Registrar Entrada o Salida (POST /api/movimientos)
document.getElementById('form-movimiento').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        producto_id: document.getElementById('mov-producto').value,
        tipo: document.getElementById('mov-tipo').value,
        cantidad: document.getElementById('mov-cantidad').value,
        motivo: document.getElementById('mov-motivo').value
    };

    const res = await fetch(`${API_URL}/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    const resultado = await res.json();
    if (!res.ok) {
        alert('❌ Error: ' + resultado.error);
    } else {
        document.getElementById('form-movimiento').reset();
        cargarInventario();
        cargarMovimientos();
    }
});

// 4. Agregar Nuevo Producto (POST /api/productos)
document.getElementById('form-producto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        id: document.getElementById('prod-id').value,
        nombre: document.getElementById('prod-nombre').value,
        categoria: document.getElementById('prod-categoria').value,
        stock_actual: document.getElementById('prod-stock').value,
        costo_unitario: document.getElementById('prod-costo').value,
        precio_mercado: document.getElementById('prod-precio').value
    };

    const res = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (res.ok) {
        document.getElementById('form-producto').reset();
        cargarInventario();
    } else {
        const err = await res.json();
        alert('❌ Error: ' + err.error);
    }
});

// 5. Editar Producto (PUT /api/productos/:id)
async function editarPrecio(id, nombre, categoria, costoActual, precioActual) {
    const nuevoPrecio = prompt(`Nuevo precio de mercado para ${nombre}:`, precioActual);
    if (nuevoPrecio === null || isNaN(nuevoPrecio)) return;

    await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre,
            categoria,
            costo_unitario: costoActual,
            precio_mercado: parseFloat(nuevoPrecio)
        })
    });
    cargarInventario();
}

// 6. Eliminar Producto (DELETE /api/productos/:id)
async function eliminarProducto(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto del inventario?')) return;
    await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
    cargarInventario();
}