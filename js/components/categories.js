/**
 * COMPONENTE: CATEGORÍAS
 * Sección de categorías de productos
 */

class CategoriesComponent {
    constructor() {
        this.container = getElement('#categories');
        this.categorias = [
            {
                id: 1,
                nombre: 'Camperas',
                imagen: 'https://via.placeholder.com/640x420?text=Camperas'
            },
            {
                id: 2,
                nombre: 'Pantalones',
                imagen: 'https://via.placeholder.com/640x420?text=Pantalones'
            },
            {
                id: 3,
                nombre: 'Guantes',
                imagen: 'https://via.placeholder.com/640x420?text=Guantes'
            },
            {
                id: 4,
                nombre: 'Tablas',
                imagen: 'https://via.placeholder.com/640x420?text=Tablas'
            }
        ];
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const categoriasHTML = this.categorias.map(categoria => `
            <article class="category-card" data-category-id="${categoria.id}">
                <img src="${categoria.imagen}" alt="${categoria.nombre}" class="category-image" loading="lazy">
                <h3>${categoria.nombre}</h3>
            </article>
        `).join('');

        const html = `
            <div class="container">
                <h2>Prepárate para esta temporada</h2>
                <div class="categories-grid">
                    ${categoriasHTML}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
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