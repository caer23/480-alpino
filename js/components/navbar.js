/**
 * COMPONENTE: NAVBAR
 * Barra de navegación principal
 */

class NavbarComponent {
    constructor() {
        this.container = getElement('#navbar');
        this.desktopBreakpoint = 768;
        this.init();
    }

    init() {
        this.render();
        this.setupLogoFallback();
        this.setupListeners();
        this.setupDropdownResponsiveness();
        this.updateCartCount();

        // Reaccionar a cambios en el carrito
        if (typeof carritoService !== 'undefined') {
            carritoService.suscribirse(() => this.updateCartCount());
        }
    }

    render() {
        const menuData = this.getMegaMenuData();
        const menuHtml = menuData
            .map((item, index) => this.renderMegaMenuItem(item, index, menuData.length))
            .join('');

        const usuario = (typeof authService !== 'undefined') ? authService.obtenerUsuario() : null;
        const accountBtn = usuario
            ? `<a href="pages/user-profile.html" class="action-btn action-btn--account" title="${usuario.nombre || 'Mi Cuenta'}">
                   <span class="account-initial">${(usuario.nombre || 'U')[0].toUpperCase()}</span>
               </a>`
            : `<a href="pages/login.html" class="action-btn" type="button">Mi Cuenta</a>`;

        const html = `
            <div class="container">
                <div class="nav-content">
                    <div class="logo">
                        <img class="logo-img" src="styles/main-logo.png" alt="Cota 480 Logo" height="60">
                        <span class="logo-fallback" aria-label="Cota 480">Cota 480</span>
                    </div>
                    <button class="hamburger-btn" id="mobileMenuBtn" type="button" aria-expanded="false" aria-controls="mainNavMenu" aria-label="Abrir menu de categorias">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <nav class="nav-menu" id="mainNavMenu" aria-label="Categorias principales">
                        ${menuHtml}
                        <div class="nav-menu-actions">
                            <button class="action-btn" type="button">Vende</button>
                            ${accountBtn}
                            <button class="action-btn cart-nav-btn" id="mobileCartBtn" type="button" aria-label="Abrir carrito">
                                🛒 <span class="cart-nav-count" id="mobileCartCount">0</span>
                            </button>
                        </div>
                    </nav>
                    <div class="nav-right">
                        <button class="action-btn" type="button">Vende</button>
                        ${accountBtn}
                        <button class="action-btn cart-nav-btn" id="cartNavBtn" type="button" aria-label="Abrir carrito">
                            🛒 <span class="cart-nav-count" id="cartNavCount">0</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    getMegaMenuData() {
        return [
            {
                label: 'Ski',
                href: '#ski',
                shopAll: 'Ver todo Ski',
                columns: [
                    {
                        title: 'Equipo',
                        links: ['Skis', 'Botas de Ski', 'Fijaciones', 'Bastones', 'Paquetes de Ski']
                    },
                    {
                        title: 'Aventura',
                        links: ['Backcountry', 'Freeride', 'All Mountain', 'Pistas', 'Junior']
                    },
                    {
                        title: 'Accesorios',
                        links: ['Cascos', 'Goggles', 'Bolsas y Mochilas', 'Guantes', 'Protecciones']
                    }
                ],
                featured: [
                    { title: 'Novedades 2027', subtitle: 'Descubre la nueva temporada', cta: 'Explorar' },
                    { title: 'Top Paquetes', subtitle: 'Kits completos listos para nieve', cta: 'Comprar ahora' }
                ]
            },
            {
                label: 'Snowboard',
                href: '#snowboard',
                shopAll: 'Ver todo Snowboard',
                columns: [
                    {
                        title: 'Equipo',
                        links: ['Tablas', 'Botas', 'Fijaciones', 'Paquetes de Snowboard', 'Splitboard']
                    },
                    {
                        title: 'Riding',
                        links: ['Freestyle', 'Freeride', 'All Mountain', 'Park', 'Backcountry']
                    },
                    {
                        title: 'Accesorios',
                        links: ['Bolsas', 'Cascos', 'Goggles', 'Guantes', 'Ropa Técnica']
                    }
                ],
                featured: [
                    { title: 'Nuevas Tablas', subtitle: 'Modelos pro para esta temporada', cta: 'Ver modelos' },
                    { title: 'Setups Recomendados', subtitle: 'Tabla + fijas + botas', cta: 'Armar setup' }
                ]
            },
            {
                label: 'Hombre',
                href: '#hombre',
                shopAll: 'Ver todo Hombre',
                columns: [
                    {
                        title: 'Ropa',
                        links: ['Chaquetas', 'Pantalones', 'Primera Capa', 'Sudaderas', 'Camisetas']
                    },
                    {
                        title: 'Calzado',
                        links: ['Botas de Nieve', 'Après-Ski', 'Trail', 'Sneakers Outdoor', 'Sandalias']
                    },
                    {
                        title: 'Accesorios',
                        links: ['Gorros', 'Guantes', 'Calcetines', 'Mochilas', 'Lentes']
                    }
                ],
                featured: [
                    { title: 'Looks de Montaña', subtitle: 'Capas listas para clima extremo', cta: 'Ver outfit' },
                    { title: 'Esenciales', subtitle: 'Lo más buscado por riders', cta: 'Comprar top' }
                ]
            },
            {
                label: 'Mujer',
                href: '#mujer',
                shopAll: 'Ver todo Mujer',
                columns: [
                    {
                        title: 'Ropa',
                        links: ['Chaquetas', 'Pantalones', 'Primera Capa', 'Fleece', 'Tops Técnicos']
                    },
                    {
                        title: 'Calzado',
                        links: ['Botas de Nieve', 'Après-Ski', 'Trail', 'Outdoor Casual', 'Sandalias']
                    },
                    {
                        title: 'Accesorios',
                        links: ['Gorros', 'Guantes', 'Calcetines', 'Mochilas', 'Lentes']
                    }
                ],
                featured: [
                    { title: 'Colección Alpina', subtitle: 'Diseño técnico con estilo', cta: 'Descubrir' },
                    { title: 'Favoritos', subtitle: 'Selección curada de temporada', cta: 'Ir a favoritos' }
                ]
            },
            {
                label: 'Kids',
                href: '#kids',
                shopAll: 'Ver todo Kids',
                columns: [
                    {
                        title: 'Ski Kids',
                        links: ['Skis Junior', 'Botas Junior', 'Cascos', 'Goggles', 'Protecciones']
                    },
                    {
                        title: 'Snowboard Kids',
                        links: ['Tablas Junior', 'Botas Junior', 'Fijaciones', 'Ropa', 'Accesorios']
                    },
                    {
                        title: 'Outdoor',
                        links: ['Chaquetas', 'Pantalones', 'Primeras Capas', 'Calzado', 'Mochilas']
                    }
                ],
                featured: [
                    { title: 'Junior Essentials', subtitle: 'Todo para empezar fuerte', cta: 'Ver esenciales' },
                    { title: 'Tallas por Edad', subtitle: 'Encuentra ajuste perfecto', cta: 'Elegir talla' }
                ]
            },
            {
                label: 'Marcas',
                href: '#marcas',
                shopAll: 'Ver todas las Marcas',
                columns: [
                    {
                        title: 'Ski & Snow',
                        links: ['Salomon', 'Atomic', 'Rossignol', 'K2', 'Burton']
                    },
                    {
                        title: 'Outdoor',
                        links: ['The North Face', 'Patagonia', 'Arc\'teryx', 'Oakley', 'Volcom']
                    },
                    {
                        title: 'Por Estilo',
                        links: ['Performance', 'Freestyle', 'Backcountry', 'Urban Outdoor', 'Junior']
                    }
                ],
                featured: [
                    { title: 'Marcas Premium', subtitle: 'Las favoritas del equipo Cota 480', cta: 'Ver marcas' },
                    { title: 'Nuevos ingresos', subtitle: 'Catálogo recién llegado', cta: 'Explorar' }
                ]
            },
            {
                label: 'Ofertas',
                href: '#ofertas',
                shopAll: 'Ver todas las Ofertas',
                columns: [
                    {
                        title: 'Por Categoría',
                        links: ['Ski Sale', 'Snowboard Sale', 'Ropa Sale', 'Calzado Sale', 'Accesorios Sale']
                    },
                    {
                        title: 'Por Perfil',
                        links: ['Hombre', 'Mujer', 'Kids', 'Backcountry', 'Urban']
                    },
                    {
                        title: 'Ayuda',
                        links: ['Últimas Tallas', 'Fin de Temporada', 'Packs con Descuento', '2x1 Seleccionado', 'Outlet']
                    }
                ],
                featured: [
                    { title: 'Hasta 50% OFF', subtitle: 'Selección especial de temporada', cta: 'Ir a ofertas' },
                    { title: 'Flash Deals', subtitle: 'Promos por tiempo limitado', cta: 'Ver ahora' }
                ],
                danger: true
            }
        ];
    }

    renderMegaMenuItem(item, index, totalItems) {
        const alignRightClass = index >= totalItems - 2 ? 'align-right' : '';

        const columnsHtml = item.columns
            .map((column) => `
                <div class="mega-column">
                    <h4>${column.title}</h4>
                    ${column.links.map((linkText) => `<a href="${item.href}" class="mega-link">${linkText}</a>`).join('')}
                </div>
            `)
            .join('');

        const featuredHtml = item.featured
            .map((feature) => `
                <a href="${item.href}" class="mega-feature-card">
                    <span class="mega-feature-title">${feature.title}</span>
                    <span class="mega-feature-subtitle">${feature.subtitle}</span>
                    <span class="mega-feature-cta">${feature.cta}</span>
                </a>
            `)
            .join('');

        return `
            <div class="menu-item has-dropdown ${alignRightClass} ${item.danger ? 'is-danger' : ''}">
                <button class="nav-link nav-trigger" type="button" aria-expanded="false">
                    ${item.label}
                    <span class="caret" aria-hidden="true">▾</span>
                </button>
                <div class="mega-dropdown" role="menu">
                    <div class="mega-top">
                        <a href="${item.href}" class="mega-shop-all">${item.shopAll}</a>
                    </div>
                    <div class="mega-grid">
                        ${columnsHtml}
                        <div class="mega-featured">${featuredHtml}</div>
                    </div>
                </div>
            </div>
        `;
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
        const mobileMenuBtn = getElement('#mobileMenuBtn');
        const navMenu = getElement('#mainNavMenu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Cart buttons
        const cartNavBtn = getElement('#cartNavBtn');
        if (cartNavBtn) {
            cartNavBtn.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('openCart'));
            });
        }

        const mobileCartBtn = getElement('#mobileCartBtn');
        if (mobileCartBtn) {
            mobileCartBtn.addEventListener('click', () => {
                this.closeMobileMenu();
                document.dispatchEvent(new CustomEvent('openCart'));
            });
        }

        // Dropdowns estilo mega menú (hover en desktop, click en touch/mobile).
        getElements('.nav-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const menuItem = trigger.closest('.menu-item');
                const shouldOpen = !menuItem.classList.contains('open');
                e.preventDefault();

                this.closeAllDropdowns();
                if (shouldOpen) {
                    this.positionSingleDropdown(menuItem);
                    menuItem.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });

            trigger.addEventListener('mouseenter', () => {
                const menuItem = trigger.closest('.menu-item');
                this.positionSingleDropdown(menuItem);
            });
        });

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.closeAllDropdowns();
                this.closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeMobileMenu();
            }
        });
    }

    updateCartCount() {
        const count = (typeof carritoService !== 'undefined') ? carritoService.obtenerCantidadTotal() : 0;
        const desktopCount = getElement('#cartNavCount');
        const mobileCount = getElement('#mobileCartCount');
        if (desktopCount) desktopCount.textContent = count;
        if (mobileCount) mobileCount.textContent = count;
    }

    setupDropdownResponsiveness() {
        const runPositioning = () => {
            this.positionAllDropdowns();

            // Ensure mobile menu state does not leak into desktop layout.
            if (window.innerWidth > this.desktopBreakpoint) {
                this.closeMobileMenu();
            }
        };

        runPositioning();
        window.addEventListener('resize', runPositioning);
        window.addEventListener('orientationchange', runPositioning);
    }

    positionAllDropdowns() {
        getElements('.menu-item.has-dropdown').forEach((menuItem) => {
            this.positionSingleDropdown(menuItem);
        });
    }

    positionSingleDropdown(menuItem) {
        if (!menuItem) return;

        const dropdown = menuItem.querySelector('.mega-dropdown');
        if (!dropdown) return;

        const isMobile = window.innerWidth <= this.desktopBreakpoint;
        if (isMobile) {
            dropdown.style.left = '';
            dropdown.style.right = '';
            dropdown.style.width = '';
            dropdown.style.maxWidth = '';
            return;
        }

        const viewportPadding = 12;
        const maxDropdownWidth = Math.max(320, Math.min(920, window.innerWidth - viewportPadding * 2));

        // Normalize anchor before measuring and then shift within viewport bounds.
        dropdown.style.right = 'auto';
        dropdown.style.left = '0px';
        dropdown.style.width = `${maxDropdownWidth}px`;
        dropdown.style.maxWidth = `${maxDropdownWidth}px`;

        const itemRect = menuItem.getBoundingClientRect();
        let leftOffset = 0;

        const overflowRight = itemRect.left + maxDropdownWidth - (window.innerWidth - viewportPadding);
        if (overflowRight > 0) {
            leftOffset -= overflowRight;
        }

        const overflowLeft = itemRect.left + leftOffset - viewportPadding;
        if (overflowLeft < 0) {
            leftOffset += Math.abs(overflowLeft);
        }

        dropdown.style.left = `${Math.round(leftOffset)}px`;
    }

    closeAllDropdowns() {
        getElements('.menu-item.open').forEach(item => {
            item.classList.remove('open');
            const trigger = item.querySelector('.nav-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    }

    toggleMobileMenu() {
        const navMenu = getElement('#mainNavMenu');
        const mobileMenuBtn = getElement('#mobileMenuBtn');
        if (!navMenu || !mobileMenuBtn) return;

        const isOpen = navMenu.classList.toggle('mobile-open');
        mobileMenuBtn.classList.toggle('is-active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menu de categorias' : 'Abrir menu de categorias');

        if (!isOpen) {
            this.closeAllDropdowns();
        }
    }

    closeMobileMenu() {
        const navMenu = getElement('#mainNavMenu');
        const mobileMenuBtn = getElement('#mobileMenuBtn');
        if (!navMenu || !mobileMenuBtn) return;

        navMenu.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('is-active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
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