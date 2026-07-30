/**
 * COMPONENTE: PÁGINA DE CARRITO
 */

class CartPageComponent {
    constructor() {
        this.coupon = ordersService.getCheckoutCoupon();
        this.couponInfo = null;
        this.shippingEstimate = 1500;
        this.init();
    }

    init() {
        this.restoreCoupon();
        this.setupListeners();
        this.render();
    }

    restoreCoupon() {
        if (!this.coupon) return;
        const subtotal = carritoService.obtenerTotal();
        try {
            this.couponInfo = ordersService.applyDiscount(subtotal, this.coupon);
        } catch (_error) {
            this.coupon = '';
            this.couponInfo = null;
            ordersService.setCheckoutCoupon('');
        }
    }

    setupListeners() {
        const applyBtn = document.getElementById('cartPageApplyCoupon');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyCoupon());
        }

        const checkoutBtn = document.getElementById('cartPageCheckout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (carritoService.estaVacio()) return;
                window.location.href = 'checkout.html';
            });
        }
    }

    applyCoupon() {
        const input = document.getElementById('cartPageCoupon');
        const feedback = document.getElementById('cartPageCouponFeedback');
        if (!input || !feedback) return;

        const code = input.value.trim().toUpperCase();
        if (!code) {
            this.coupon = '';
            this.couponInfo = null;
            ordersService.setCheckoutCoupon('');
            feedback.textContent = 'Cupón eliminado';
            feedback.className = 'cart-page-coupon-feedback info';
            this.render();
            return;
        }

        try {
            this.couponInfo = ordersService.applyDiscount(carritoService.obtenerTotal(), code);
            this.coupon = code;
            ordersService.setCheckoutCoupon(code);
            feedback.textContent = `✅ Cupón aplicado: ${this.couponInfo.label}`;
            feedback.className = 'cart-page-coupon-feedback success';
        } catch (error) {
            this.coupon = '';
            this.couponInfo = null;
            ordersService.setCheckoutCoupon('');
            feedback.textContent = `❌ ${error.message}`;
            feedback.className = 'cart-page-coupon-feedback error';
        }

        this.render();
    }

    updateTotals(subtotal) {
        const discount = this.couponInfo?.amount || 0;
        const taxableBase = Math.max(subtotal - discount, 0);
        const tax = Math.round(taxableBase * 0.21);
        const total = taxableBase + tax + this.shippingEstimate;

        document.getElementById('cartPageSubtotal').textContent = formatearMoneda(subtotal);
        document.getElementById('cartPageTax').textContent = formatearMoneda(tax);
        document.getElementById('cartPageTotal').textContent = formatearMoneda(total);

        const discountRow = document.getElementById('cartPageDiscountRow');
        if (discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('cartPageDiscountLabel').textContent = this.couponInfo.label;
            document.getElementById('cartPageDiscount').textContent = `- ${formatearMoneda(discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    render() {
        const container = document.getElementById('cartPageItems');
        if (!container) return;

        const items = carritoService.obtenerItems();
        const subtotal = carritoService.obtenerTotal();
        const couponInput = document.getElementById('cartPageCoupon');
        if (couponInput && this.coupon) couponInput.value = this.coupon;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="cart-page-empty">
                    <p>Tu carrito está vacío.</p>
                    <a href="../index.html">Explorar productos</a>
                </div>
            `;
            document.getElementById('cartPageCheckout').disabled = true;
            this.updateTotals(0);
            return;
        }

        document.getElementById('cartPageCheckout').disabled = false;

        container.innerHTML = items.map(item => `
            <article class="cart-page-item" data-id="${item.id}">
                <img src="${item.imagen || ''}" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/90x90?text=📦'">
                <div class="cart-page-item-info">
                    <h3>${item.nombre}</h3>
                    <p>${formatearMoneda(item.precio)} c/u</p>
                    <div class="cart-page-qty">
                        <button type="button" data-action="decrease">−</button>
                        <span>${item.cantidad}</span>
                        <button type="button" data-action="increase">+</button>
                    </div>
                </div>
                <div class="cart-page-item-price">
                    <strong>${formatearMoneda(item.precio * item.cantidad)}</strong>
                    <button type="button" data-action="remove">Eliminar</button>
                </div>
            </article>
        `).join('');

        this.bindItemActions();
        this.updateTotals(subtotal);
    }

    bindItemActions() {
        document.querySelectorAll('.cart-page-item').forEach(row => {
            const id = parseInt(row.dataset.id, 10);
            row.querySelectorAll('button[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    const item = carritoService.obtenerProducto(id);
                    if (!item) return;

                    if (action === 'increase') {
                        carritoService.actualizarCantidad(id, item.cantidad + 1);
                    }
                    if (action === 'decrease') {
                        carritoService.actualizarCantidad(id, item.cantidad - 1);
                    }
                    if (action === 'remove') {
                        carritoService.removerProducto(id);
                    }

                    if (this.coupon) {
                        try {
                            this.couponInfo = ordersService.applyDiscount(carritoService.obtenerTotal(), this.coupon);
                        } catch (_e) {
                            this.coupon = '';
                            this.couponInfo = null;
                        }
                    }

                    this.render();
                });
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CartPageComponent());
} else {
    new CartPageComponent();
}
