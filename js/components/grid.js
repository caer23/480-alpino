/**
 * COMPONENTE: GRID
 * Vista en cuadrícula de productos
 */

class GridComponent {
    constructor() {
        this.container = getElement('#featuredProducts');
        this.productosFiltrados = [];
        this.init();
    }

    init() {
        this.render();
        this.setupListeners();
    }

    render() {
        const productos = productosService.obtenerTodos();
        const productosHTML = productos.map(producto => `
            <div class="product-item" data-product-id="${producto.id}">
                <div class="product-image">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <h3>${producto.nombre}</h3>
                <p class="product-price">${formatearMoneda(producto.precio)}</p>
                <button class="btn-add-small" data-id="${producto.id}">AÑADIR</button>
            </div>
        `).join('');

        const html = `
            <div class="container">
                <h2>PRODUCTOS DESTACADOS</h2>
                <div class="grid-controls">
                    <div class="sort-control">
                        <label for="sortSelect">Ordenar:</label>
                        <select id="sortSelect" class="sort-select">
                            <option value="nombre">Nombre (A-Z)</option>
                            <option value="precio-asc">Precio: Menor a Mayor</option>
                            <option value="precio-desc">Precio: Mayor a Menor</option>
                        </select>
                    </div>
                </div>
                <div class="products-grid">
                    ${productosHTML}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    setupListeners() {
        // Ordenamiento
        const sortSelect = getElement('#sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }

        // Botones de agregar
        getElements('.products-grid .btn-add-small').forEach(btn => {
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

    handleSort(criterio) {
        const productos = productosService.obtenerTodos();
        const productosOrdenados = productosService.ordenar(productos, criterio);
        this.renderProductos(productosOrdenados);
    }

    renderProductos(productos) {
        const grid = getElement('.products-grid');
        if (!grid) return;

        const productosHTML = productos.map(producto => `
            <div class="product-item" data-product-id="${producto.id}">
                <div class="product-image">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <h3>${producto.nombre}</h3>
                <p class="product-price">${formatearMoneda(producto.precio)}</p>
                <button class="btn-add-small" data-id="${producto.id}">AÑADIR</button>
            </div>
        `).join('');

        grid.innerHTML = productosHTML;
        this.setupListeners();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GridComponent();
    });
} else {
    new GridComponent();
}