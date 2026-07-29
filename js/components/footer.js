/**
 * COMPONENTE: FOOTER
 * Pie de página - Diseño completo con secciones COMPRADOR, VENDIENDO, CONFIÁ y Síguenos
 */

class FooterComponent {
    constructor() {
        this.container = getElement('#footer');
        this.init();
    }

    init() {
        this.render();
        this.setupListeners();
    }

    render() {
        const html = `
            <div class="footer-inner">

                <!-- Beneficios destacados -->
                <div class="footer-benefits-bar">
                    <div class="container">
                        <div class="footer-benefits">
                            <div class="benefit-item">
                                <span class="benefit-icon">🔒</span>
                                <div>
                                    <p class="benefit-title">100% Segura</p>
                                    <p class="benefit-description">Transacciones protegidas en todo momento</p>
                                </div>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">🚚</span>
                                <div>
                                    <p class="benefit-title">Despacho en 5 días</p>
                                    <p class="benefit-description">O te devolvemos tu dinero</p>
                                </div>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">🔄</span>
                                <div>
                                    <p class="benefit-title">Todas tus compras tienen cambio</p>
                                    <p class="benefit-description">Sin complicaciones ni letra chica</p>
                                </div>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">💳</span>
                                <div>
                                    <p class="benefit-title">Múltiples medios de pago</p>
                                    <p class="benefit-description">Tarjeta, transferencia y más</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contenido principal del footer -->
                <div class="footer-main">
                    <div class="container">
                        <div class="footer-content">

                            <!-- Columna COMPRADOR -->
                            <div class="footer-col">
                                <h3 class="footer-col-title">COMPRADOR</h3>
                                <ul class="footer-links">
                                    <li><a href="#faq-pago" class="footer-link footer-faq-link">¿Cómo son las formas de pago?</a></li>
                                    <li><a href="#faq-envio" class="footer-link footer-faq-link">¿Cómo son los medios de envío?</a></li>
                                    <li><a href="#faq-cambios" class="footer-link footer-faq-link">¿Cómo funcionan los cambios?</a></li>
                                    <li><a href="#faq-cupon" class="footer-link footer-faq-link">¿Cómo aplico un cupón de descuento?</a></li>
                                </ul>
                            </div>

                            <!-- Columna VENDIENDO -->
                            <div class="footer-col">
                                <h3 class="footer-col-title">VENDIENDO</h3>
                                <ul class="footer-links">
                                    <li><a href="#faq-publicar" class="footer-link footer-faq-link">¿Cómo publico un producto?</a></li>
                                    <li><a href="#faq-costo" class="footer-link footer-faq-link">¿Qué costo tiene publicar?</a></li>
                                    <li><a href="#faq-envio-venta" class="footer-link footer-faq-link">¿Cómo envío mis productos?</a></li>
                                    <li><a href="#faq-cobro" class="footer-link footer-faq-link">¿Cómo cobro mis ventas?</a></li>
                                </ul>
                            </div>

                            <!-- Columna CONFIÁ -->
                            <div class="footer-col">
                                <h3 class="footer-col-title">CONFIÁ</h3>
                                <ul class="footer-trust-list">
                                    <li>
                                        <span class="trust-icon">🤝</span>
                                        <span>Sin necesidad de encontrarte con tu comprador</span>
                                    </li>
                                    <li>
                                        <span class="trust-icon">💰</span>
                                        <span>Cobrá tus ventas como más te convenga</span>
                                    </li>
                                    <li>
                                        <span class="trust-icon">📦</span>
                                        <span>Logística integrada de principio a fin</span>
                                    </li>
                                    <li>
                                        <span class="trust-icon">⭐</span>
                                        <span>Comunidad verificada de compradores y vendedores</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Columna SÍGUENOS + Newsletter -->
                            <div class="footer-col">
                                <h3 class="footer-col-title">SÍGUENOS</h3>
                                <div class="footer-social-links">
                                    <a href="https://www.instagram.com/cota480" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
                                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.facebook.com/cota480" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook">
                                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    <a href="https://www.tiktok.com/@cota480" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="TikTok">
                                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                                        </svg>
                                    </a>
                                </div>

                                <div class="footer-newsletter">
                                    <p class="footer-newsletter-label">Suscribite a nuestras novedades</p>
                                    <form class="footer-newsletter-form" id="newsletterForm">
                                        <input type="email" placeholder="tu@email.com" class="footer-newsletter-input" aria-label="Email para newsletter">
                                        <button type="submit" class="footer-newsletter-btn">Suscribirse</button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Footer bottom -->
                <div class="footer-bottom-bar">
                    <div class="container">
                        <div class="footer-bottom">
                            <p class="footer-copyright">&copy; 2026 Cota 480. Todos los derechos reservados.</p>
                            <div class="footer-legal-links">
                                <a href="#privacy" class="footer-legal-link footer-faq-link">Privacidad</a>
                                <a href="#terms" class="footer-legal-link footer-faq-link">Términos y Condiciones</a>
                                <a href="#cookies" class="footer-legal-link footer-faq-link">Cookies</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        this.container.innerHTML = html;
    }

    setupListeners() {
        getElements('.footer-faq-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                NotificacionesComponent.mostrar('Sección en construcción', 'info');
            });
        });

        const newsletterForm = getElement('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = newsletterForm.querySelector('.footer-newsletter-input');
                if (input && input.value) {
                    NotificacionesComponent.mostrar('¡Suscripción exitosa!', 'success');
                    input.value = '';
                }
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FooterComponent();
    });
} else {
    new FooterComponent();
}