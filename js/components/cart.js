/**
 * COMPONENTE: CARRITO
 * Interfaz del carrito de compras
 */

class CartComponent {
    constructor() {
        this.sidebar = getElement('#cartSidebar');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.setupListeners();
        
        // Escuchar evento para abrir carrito
        document.addEventListener('openCart', () => this.toggle());
    }

    render() {
        const items = carritoService.obtenerItems();
        const total = carritoService.obtenerTotal();

        let itemsHTML = '';

        if (items.length === 0) {
            itemsHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        } else {
            itemsHTML = items.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="item-info">
                        <h4>${item.nombre}</h4>
                        <p class="item-price">${formatearMoneda(item.precio)}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-action="decrease">-</button>
                        <input type="number" class="qty-input" value="${item.cantidad}" min="1">
                        <button class="qty-btn plus" data-action="increase">+</button>
                    </div>
                    <button class="btn-remove" data-action="remove">✕</button>
                </div>
            `).join('');
        }

        const html = `
            <div class="cart-overlay"></div>
            <div class="cart-container">
                <div class="cart-header">
                    <h2>MI CARRITO</h2>
                    <button class="btn-close" id="closeCart">✕</button>
                </div>
                <div class="cart-items">
                    ${itemsHTML}
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>TOTAL:</span>
                        <span class="total-amount">${formatearMoneda(total)}</span>
                    </div>
                    <button class="btn-checkout" ${items.length === 0 ? 'disabled' : ''}>PROCEDER AL CHECKOUT</button>
                    <button class="btn-continue-shopping">CONTINUAR COMPRANDO</button>
                </div>
            </div>
        `;

        this.sidebar.innerHTML = html;
        this.setupItemListeners();
    }

    setupItemListeners() {
        // Cerrar carrito
        const closeBtn = getElement('#closeCart');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggle());
        }

        // Click en overlay
        const overlay = getElement('.cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.toggle());
        }

        // Botones de cantidad
        getElements('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = btn.closest('.cart-item');
                const itemId = parseInt(cartItem.dataset.itemId);
                const action = btn.dataset.action;
                const item = carritoService.obtenerProducto(itemId);

                if (action === 'increase') {
                    carritoService.actualizarCantidad(itemId, item.cantidad + 1);
                } else if (action === 'decrease') {
                    carritoService.actualizarCantidad(itemId, item.cantidad - 1);
                }

                this.render();
            });
        });

        // Botón remove
        getElements('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const cartItem = btn.closest('.cart-item');
                const itemId = parseInt(cartItem.dataset.itemId);
                carritoService.removerProducto(itemId);
                NotificacionesComponent.mostrar(MENSAJES.PRODUCTO_ELIMINADO, 'info');
                this.render();
            });
        });

        // Botón continuar comprando
        const continueBtm = getElement('.btn-continue-shopping');
        if (continueBtm) {
            continueBtm.addEventListener('click', () => this.toggle());
        }

        // Botón checkout
        const checkoutBtn = getElement('.btn-checkout');
        if (checkoutBtn && !checkoutBtn.disabled) {
            checkoutBtn.addEventListener('click', () => {
                NotificacionesComponent.mostrar('Redirigiendo a checkout...', 'info');
                setTimeout(() => this.toggle(), 500);
            });
        }
    }

    setupListeners() {
        // Aquí se pueden agregar listeners globales si es necesario
    }

    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.render();
            addClass(this.sidebar, 'open');
        } else {
            removeClass(this.sidebar, 'open');
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CartComponent();
    });
} else {
    new CartComponent();
}