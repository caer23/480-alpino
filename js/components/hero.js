/**
 * COMPONENTE: HERO
 * Sección hero principal con productos destacados
 */

class HeroComponent {
    constructor() {
        this.container = getElement('#hero');
        this.init();
    }

    init() {
        this.render();
        this.setupListeners();
    }

    render() {
        const productosDestacados = productosService.obtenerDestacados(3);
        
        const productosHTML = productosDestacados.map(producto => `
            <div class="product-card" data-product-id="${producto.id}">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                <h3>${producto.nombre}</h3>
                <p class="price">${formatearMoneda(producto.precio)}</p>
                <button class="btn-add" data-id="${producto.id}">AÑADIR</button>
            </div>
        `).join('');

        const html = `
            <div class="hero-content">
                <h1>EL INVIERNO EMPIEZA<br>EN 480 ALPINO.</h1>
                <button class="btn-primary" id="verEquipamientoBtm">VER EQUIPAMIENTO.</button>
            </div>
            <div class="hero-products">
                ${productosHTML}
            </div>
        `;

        this.container.innerHTML = html;
    }

    setupListeners() {
        // Botón ver equipamiento
        const verEquipBtn = getElement('#verEquipamientoBtm');
        if (verEquipBtn) {
            verEquipBtn.addEventListener('click', () => {
                smoothScroll('#featuredProducts', 100);
            });
        }

        // Botones de agregar al carrito
        getElements('.hero-products .btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.dataset.id);
                const producto = productosService.obtenerPorId(productId);
                if (producto) {
                    carritoService.agregarProducto(producto, 1);
                    NotificacionesComponent.mostrar(MENSAJES.PRODUCTO_AGREGADO, 'success');
                }
            });
        });
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeroComponent();
    });
} else {
    new HeroComponent();
}