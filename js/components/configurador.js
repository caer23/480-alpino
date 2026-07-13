/**
 * COMPONENTE: CONFIGURADOR
 * Configurador de equipamiento personalizado
 */

class ConfiguradorComponent {
    constructor() {
        this.container = getElement('#configurador');
        this.recomendaciones = {};
        this.init();
    }

    init() {
        this.render();
        this.setupListeners();
    }

    render() {
        const { nivel, altura, terreno } = CONFIGURADOR_OPCIONES;

        const html = `
            <div class="container">
                <h2>CONFIGURADOR DE EQUIPAMIENTO 480</h2>
                <div class="config-controls">
                    <div class="control-group">
                        <label for="nivelSelect">NIVEL</label>
                        <select id="nivelSelect" class="config-select">
                            <option value="">Selecciona un nivel</option>
                            ${nivel.map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="alturaSelect">ALTURA</label>
                        <select id="alturaSelect" class="config-select">
                            <option value="">Selecciona altura</option>
                            ${altura.map(a => `<option value="${a}">${a}</option>`).join('')}
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="terrenoSelect">TERRENO</label>
                        <select id="terrenoSelect" class="config-select">
                            <option value="">Selecciona terreno</option>
                            ${terreno.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn-recommend" id="btnRecomendar">RECOMENDAR</button>
                </div>
                <div id="resultadoConfig" class="resultado-config"></div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    setupListeners() {
        const btnRecomendar = getElement('#btnRecomendar');
        if (btnRecomendar) {
            btnRecomendar.addEventListener('click', () => this.generarRecomendacion());
        }
    }

    generarRecomendacion() {
        const nivel = getElement('#nivelSelect').value;
        const altura = getElement('#alturaSelect').value;
        const terreno = getElement('#terrenoSelect').value;

        if (!nivel || !altura || !terreno) {
            NotificacionesComponent.mostrar('Completa todos los campos', 'warning');
            return;
        }

        // Lógica de recomendación basada en configuración
        let productoRecomendado = this.obtenerRecomendacion(nivel, altura, terreno);

        this.mostrarRecomendacion(productoRecomendado);
    }

    obtenerRecomendacion(nivel, altura, terreno) {
        // Simplificado: devuelve un producto según la configuración
        if (nivel === 'Principiante') {
            return productosService.obtenerPorId(1); // Tabla SUMMIT
        } else if (nivel === 'Intermedio') {
            return productosService.obtenerPorId(3); // Kit Splitboard
        } else {
            return productosService.obtenerPorId(3); // Kit Splitboard
        }
    }

    mostrarRecomendacion(producto) {
        const resultadoDiv = getElement('#resultadoConfig');
        if (!producto) {
            resultadoDiv.innerHTML = '<p>No se encontró recomendación</p>';
            return;
        }

        const html = `
            <div class="recomendacion-card">
                <h3>${producto.nombre}</h3>
                <p class="precio">${formatearMoneda(producto.precio)}</p>
                <p class="descripcion">${producto.descripcion}</p>
                <button class="btn-add" data-id="${producto.id}">AÑADIR AL CARRITO</button>
            </div>
        `;

        resultadoDiv.innerHTML = html;

        // Setup listener para el botón de agregar
        const btnAgregar = getElement('#resultadoConfig .btn-add');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                carritoService.agregarProducto(producto, 1);
                NotificacionesComponent.mostrar(MENSAJES.PRODUCTO_AGREGADO, 'success');
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ConfiguradorComponent();
    });
} else {
    new ConfiguradorComponent();
}