/**
 * COMPONENTE: CARRITO
 * Interfaz del carrito de compras
 */

const CUPONES_CARRITO = {
    'NIEVE480': { descuento: 0.15, label: '15% OFF' },
    'CREW10': { descuento: 0.10, label: '10% OFF' },
    'BIENVENIDO': { descuento: 0.20, label: '20% OFF - Bienvenida' }
};

class CartComponent {
    constructor() {
        this.sidebar = getElement('#cartSidebar');
        this.isOpen = false;
        this.cuponAplicado = null;
        this.init();
    }

    init() {
        this.setupListeners();
        
        // Escuchar evento para abrir carrito
        document.addEventListener('openCart', () => this.toggle());
    }

    render() {
        const items = carritoService.obtenerItems();
        const subtotal = carritoService.obtenerTotal();
        const descuento = this.cuponAplicado ? subtotal * this.cuponAplicado.descuento : 0;
        const total = subtotal - descuento;

        let itemsHTML = '';

        if (items.length === 0) {
            itemsHTML = `
                <div class="empty-cart">
                    <div style="font-size:48px;margin-bottom:12px">🛒</div>
                    <p>Tu carrito está vacío</p>
                </div>`;
        } else {
            itemsHTML = items.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <img class="cart-item-img" src="${item.imagen || ''}" alt="${item.nombre}"
                        onerror="this.src='https://via.placeholder.com/60x60?text=📦'">
                    <div class="item-info">
                        <h4>${item.nombre}</h4>
                        <p class="item-unit-price">${formatearMoneda(item.precio)} c/u</p>
                        <p class="item-subtotal">${formatearMoneda(item.precio * item.cantidad)}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn minus" data-action="decrease" aria-label="Disminuir cantidad">−</button>
                        <span class="qty-display">${item.cantidad}</span>
                        <button class="qty-btn plus" data-action="increase" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <button class="btn-remove" data-action="remove" aria-label="Eliminar producto">✕</button>
                </div>
            `).join('');
        }

        const couponHTML = `
            <div class="cart-coupon">
                <input type="text" class="coupon-input-cart" id="cartCouponInput"
                    placeholder="Cupón de descuento"
                    value="${this.cuponAplicado ? '' : ''}"
                    ${this.cuponAplicado ? 'disabled' : ''}>
                <button class="btn-apply-coupon-cart" id="applyCouponCartBtn">
                    ${this.cuponAplicado ? '✕' : 'Aplicar'}
                </button>
            </div>
            ${this.cuponAplicado ? `<p class="coupon-tag">✅ ${this.cuponAplicado.label} aplicado</p>` : ''}
        `;

        const html = `
            <div class="cart-overlay"></div>
            <div class="cart-container">
                <div class="cart-header">
                    <h2>MI CARRITO <span class="cart-count-badge">${carritoService.obtenerCantidadTotal()}</span></h2>
                    <button class="btn-close" id="closeCart" aria-label="Cerrar carrito">✕</button>
                </div>
                <div class="cart-items">
                    ${itemsHTML}
                </div>
                <div class="cart-footer">
                    ${couponHTML}
                    <div class="cart-totals">
                        ${descuento > 0 ? `
                        <div class="cart-total-row">
                            <span>Subtotal:</span>
                            <span>${formatearMoneda(subtotal)}</span>
                        </div>
                        <div class="cart-total-row discount-row">
                            <span>${this.cuponAplicado.label}:</span>
                            <span>- ${formatearMoneda(descuento)}</span>
                        </div>
                        ` : ''}
                        <div class="cart-total">
                            <span>TOTAL:</span>
                            <span class="total-amount">${formatearMoneda(total)}</span>
                        </div>
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
        const overlay = this.sidebar.querySelector('.cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.toggle());
        }

        // Botones de cantidad
        this.sidebar.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cartItem = btn.closest('.cart-item');
                const itemId = parseInt(cartItem.dataset.itemId);
                const action = btn.dataset.action;
                const item = carritoService.obtenerProducto(itemId);
                if (!item) return;

                if (action === 'increase') {
                    carritoService.actualizarCantidad(itemId, item.cantidad + 1);
                } else if (action === 'decrease') {
                    carritoService.actualizarCantidad(itemId, item.cantidad - 1);
                }

                this.render();
            });
        });

        // Botón remove
        this.sidebar.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const cartItem = btn.closest('.cart-item');
                const itemId = parseInt(cartItem.dataset.itemId);
                carritoService.removerProducto(itemId);
                if (typeof NotificacionesComponent !== 'undefined') {
                    NotificacionesComponent.mostrar(MENSAJES.PRODUCTO_ELIMINADO, 'info');
                }
                this.render();
            });
        });

        // Cupón
        const applyCouponBtn = document.getElementById('applyCouponCartBtn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                if (this.cuponAplicado) {
                    // Quitar cupón
                    this.cuponAplicado = null;
                    this.render();
                    return;
                }
                const input = document.getElementById('cartCouponInput');
                const code = input ? input.value.trim().toUpperCase() : '';
                const cupon = CUPONES_CARRITO[code];
                if (cupon) {
                    this.cuponAplicado = cupon;
                } else if (code) {
                    input.placeholder = '❌ Cupón inválido';
                    input.value = '';
                }
                this.render();
            });
        }

        // Botón continuar comprando
        const continueBtn = this.sidebar.querySelector('.btn-continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.toggle());
        }

        // Botón checkout
        const checkoutBtn = this.sidebar.querySelector('.btn-checkout');
        if (checkoutBtn && !checkoutBtn.disabled) {
            checkoutBtn.addEventListener('click', () => {
                this.toggle();
                // Redirigir a checkout
                const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                window.location.href = base + 'checkout.html';
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