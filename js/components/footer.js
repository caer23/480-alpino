/**
 * COMPONENTE: FOOTER
 * Pie de página
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
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>480 ALPINO</h4>
                        <p>Equipamiento premium para los amantes del invierno y la nieve.</p>
                    </div>
                    <div class="footer-section">
                        <h4>INFORMACIÓN</h4>
                        <ul>
                            <li><a href="#about">Sobre Nosotros</a></li>
                            <li><a href="#contact">Contacto</a></li>
                            <li><a href="#shipping">Envíos</a></li>
                            <li><a href="#returns">Devoluciones</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>POLÍTICAS</h4>
                        <ul>
                            <li><a href="#privacy">Privacidad</a></li>
                            <li><a href="#terms">Términos</a></li>
                            <li><a href="#warranty">Garantía</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>SÍGUENOS</h4>
                        <div class="social-links">
                            <a href="#facebook">Facebook</a>
                            <a href="#instagram">Instagram</a>
                            <a href="#twitter">Twitter</a>
                            <a href="#youtube">YouTube</a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2026 480 Alpino. Todos los derechos reservados.</p>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    setupListeners() {
        getElements('.footer-section a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                NotificacionesComponent.mostrar('Redirección en construcción', 'info');
            });
        });
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