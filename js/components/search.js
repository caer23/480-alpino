/**
 * COMPONENTE: BÚSQUEDA
 * Interfaz de búsqueda de productos
 */

class SearchComponent {
    constructor() {
        this.container = getElement('#searchModal');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.setupListeners();
        
        // Escuchar evento para abrir búsqueda
        document.addEventListener('openSearch', () => this.toggle());
    }

    render() {
        const resultados = searchService.obtenerResultados();
        const termino = searchService.obtenerTermino();

        let resultadosHTML = '';

        if (resultados.length === 0 && termino) {
            resultadosHTML = `<p class="no-results">${MENSAJES.SIN_RESULTADOS}</p>`;
        } else if (resultados.length > 0) {
            resultadosHTML = resultados.map(producto => `
                <div class="search-result-item" data-product-id="${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="result-image">
                    <div class="result-info">
                        <h4>${producto.nombre}</h4>
                        <p class="result-price">${formatearMoneda(producto.precio)}</p>
                        <p class="result-desc">${producto.descripcion}</p>
                    </div>
                    <button class="btn-add-result" data-id="${producto.id}">AÑADIR</button>
                </div>
            `).join('');
        }

        const isInPages = window.location.pathname.includes('/pages/');
        const searchBase = isInPages ? '' : 'pages/';
        const verTodosHTML = termino && resultados.length > 0
            ? `<a class="search-ver-todos" href="${searchBase}search-results.html?q=${encodeURIComponent(termino)}">Ver todos los resultados (${resultados.length}) →</a>`
            : '';

        const html = `
            <div class="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <input type="text" class="search-field" value="${termino}" placeholder="Busca productos...">
                    <button class="btn-close-search" id="closeSearch">✕</button>
                </div>
                <div class="search-results">
                    ${resultadosHTML}
                    ${verTodosHTML}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.setupItemListeners();
    }

    setupItemListeners() {
        // Cerrar búsqueda
        const closeBtn = getElement('#closeSearch');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggle());
        }

        // Click en overlay
        const overlay = getElement('.search-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.toggle());
        }

        // Campo de búsqueda
        const searchField = getElement('.search-field');
        if (searchField) {
            const debouncedSearch = debounce((value) => {
                searchService.buscar(value);
                this.render();
            }, 300);

            searchField.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });

            // Enter → go to search results page
            searchField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = searchField.value.trim();
                    if (val) {
                        const isInPages = window.location.pathname.includes('/pages/');
                        const base = isInPages ? '' : 'pages/';
                        window.location.href = `${base}search-results.html?q=${encodeURIComponent(val)}`;
                    }
                }
            });

            // Focus on open
            setTimeout(() => { if (searchField) searchField.focus(); }, 100);
        }

        // Click en resultado → ir a detalle
        getElements('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.btn-add-result')) return;
                const productId = item.dataset.productId;
                if (productId) {
                    const isInPages = window.location.pathname.includes('/pages/');
                    const base = isInPages ? '' : 'pages/';
                    window.location.href = `${base}product-detail.html?id=${productId}`;
                }
            });
        });

        // Botones de agregar
        getElements('.btn-add-result').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.id);
                const producto = productosService.obtenerPorId(productId);
                if (producto) {
                    carritoService.agregarProducto(producto, 1);
                    NotificacionesComponent.mostrar(MENSAJES.PRODUCTO_AGREGADO, 'success');
                }
            });
        });
    }

    setupListeners() {
        // Listeners globales si es necesario
    }

    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.render();
            addClass(this.container, 'open');
        } else {
            removeClass(this.container, 'open');
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SearchComponent();
    });
} else {
    new SearchComponent();
}