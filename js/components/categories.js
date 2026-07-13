/**
 * COMPONENTE: CATEGORÍAS
 * Sección de categorías de productos
 */

class CategoriesComponent {
    constructor() {
        this.container = getElement('#categories');
        this.init();
    }

    init() {
        this.render();
        this.setupListeners();
    }

    render() {
        const categorias = productosService.obtenerCategorias();
        const categoriasHTML = categorias.map(cat => `
            <div class="category-card" data-category-id="${cat.id}">
                <div class="category-icon">${cat.icono}</div>
                <h3>${cat.nombre}</h3>
                <p>${cat.descripcion}</p>
            </div>
        `).join('');

        const html = `
            <div class="container">
                <h2>CATEGORÍAS</h2>
                <div class="categories-grid">
                    ${categoriasHTML}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    setupListeners() {
        getElements('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.categoryId;
                const categoria = productosService.obtenerCategoriaPorId(parseInt(categoryId));
                if (categoria) {
                    smoothScroll('#featuredProducts', 100);
                    NotificacionesComponent.mostrar(`Viendo productos de: ${categoria.nombre}`, 'info');
                }
            });
        });
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CategoriesComponent();
    });
} else {
    new CategoriesComponent();
}