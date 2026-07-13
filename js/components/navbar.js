/**
 * COMPONENTE: NAVBAR
 * Barra de navegación principal
 */

class NavbarComponent {
    constructor() {
        this.container = getElement('#navbar');
        this.cartCount = 0;
        this.init();
    }

    init() {
        this.render();
        this.setupLogoFallback();
        this.setupListeners();
        this.updateCartCount();
        
        // Suscribirse a cambios del carrito
        carritoService.suscribirse(() => this.updateCartCount());
    }

    render() {
        const html = `
            <div class="container">
                <div class="nav-content">
                    <div class="logo">
                        <img class="logo-img" src="styles/main-logo.png" alt="480 Alpino Logo" height="60">
                        <span class="logo-fallback" aria-label="480 Alpino">480 Alpino</span>
                    </div>
                    <nav class="nav-menu">
                        <a href="#inicio" class="nav-link">INICIO</a>
                        <a href="#hardware" class="nav-link">HARDWARE</a>
                        <a href="#tecnologia" class="nav-link">TECNOLOGÍA</a>
                        <a href="#optica" class="nav-link">ÓPTICA</a>
                        <a href="#mas" class="nav-link">MAS</a>
                    </nav>
                    <div class="nav-right">
                        <div class="search-bar">
                            <input type="text" id="searchInput" placeholder="BUSCAR PRODUCTOS" class="search-input">
                            <button class="search-btn">🔍</button>
                        </div>
                        <div class="user-section">
                            <input type="text" placeholder="User Name" class="input-user">
                            <input type="email" placeholder="Email. Cliente" class="input-email">
                        </div>
                        <div class="cart-icon" id="cartIcon">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E8D5C4" stroke-width="2">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            <span class="cart-count" id="cartCount">0</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="subnavbar">
                <div class="container">
                    <a href="#celurino" class="subnavbar-link">CELURINO</a>
                    <a href="#oroete" class="subnavbar-link">OROETE</a>
                    <a href="#recuia" class="subnavbar-link">RECUIA</a>
                    <a href="#ecliparmabas" class="subnavbar-link">ECLIPARMABAS</a>
                    <a href="#buscinas" class="subnavbar-link">BUSCINAS</a>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    setupLogoFallback() {
        const logoImg = this.container?.querySelector('.logo-img');
        const logoFallback = this.container?.querySelector('.logo-fallback');

        if (!logoImg || !logoFallback) return;

        const showFallback = () => {
            logoImg.style.display = 'none';
            logoFallback.style.display = 'inline-block';
        };

        logoFallback.style.display = 'none';

        // If the browser has already resolved the image and it is broken, switch immediately.
        if (logoImg.complete && logoImg.naturalWidth === 0) {
            showFallback();
            return;
        }

        logoImg.addEventListener('error', showFallback);
    }

    setupListeners() {
        const searchBtn = getElement('.search-btn');
        const searchInput = getElement('#searchInput');
        const cartIcon = getElement('#cartIcon');

        // Búsqueda
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        // Carrito
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                const event = new CustomEvent('openCart');
                document.dispatchEvent(event);
            });
        }

        // Links de navegación
        getElements('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                smoothScroll(href);
            });
        });
    }

    handleSearch() {
        const searchInput = getElement('#searchInput');
        if (searchInput) {
            const termino = searchInput.value.trim();
            if (termino) {
                searchService.buscar(termino);
                const event = new CustomEvent('openSearch');
                document.dispatchEvent(event);
            } else {
                NotificacionesComponent.mostrar(MENSAJES.BUSQUEDA_VACIA, 'warning');
            }
        }
    }

    updateCartCount() {
        const count = carritoService.obtenerCantidadTotal();
        const cartCountElement = getElement('#cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            if (count > 0) {
                addClass(cartCountElement, 'active');
            } else {
                removeClass(cartCountElement, 'active');
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NavbarComponent();
    });
} else {
    new NavbarComponent();
}