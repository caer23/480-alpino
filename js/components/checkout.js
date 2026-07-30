/**
 * COMPONENTE: CHECKOUT
 */

class CheckoutComponent {
    constructor() {
        this.currentStep = 1;
        this.maxStep = 4;
        this.items = carritoService.obtenerItems();
        this.user = typeof authService !== 'undefined' ? authService.obtenerUsuario() : null;
        this.selectedShippingMethod = 'standard';
        this.selectedPaymentMethod = 'mercadopago';
        this.selectedInstallments = 1;
        this.couponCode = ordersService.getCheckoutCoupon();
        this.couponInfo = null;
        this.csrfToken = this.generateCsrfToken();
        this.init();
    }

    init() {
        if (this.items.length === 0) {
            this.showGlobalError('Tu carrito está vacío. Volvé al carrito para agregar productos.');
            return;
        }

        this.setCsrfToken();
        this.loadUserDefaults();
        this.loadSavedAddresses();
        this.restoreCoupon();
        this.setupListeners();
        this.updateShippingNote();
        this.renderSummary();
        this.goToStep(1);
        this.checkSecureContext();
    }

    generateCsrfToken() {
        return `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    }

    setCsrfToken() {
        sessionStorage.setItem('480_checkout_csrf', this.csrfToken);
        const input = document.getElementById('csrfToken');
        if (input) input.value = this.csrfToken;
    }

    checkSecureContext() {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            this.showGlobalError('El checkout requiere HTTPS para proteger tus datos.');
        }
    }

    restoreCoupon() {
        if (!this.couponCode) return;
        try {
            this.couponInfo = ordersService.applyDiscount(carritoService.obtenerTotal(), this.couponCode);
        } catch (_e) {
            this.couponCode = '';
            this.couponInfo = null;
            ordersService.setCheckoutCoupon('');
        }
    }

    loadUserDefaults() {
        if (!this.user) return;

        const defaults = {
            shipName: `${this.user.nombre || ''} ${this.user.apellido || ''}`.trim(),
            shipEmail: this.user.email || '',
            shipPhone: this.user.telefono || ''
        };

        Object.entries(defaults).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field && !field.value) field.value = value;
        });
    }

    loadSavedAddresses() {
        const container = document.getElementById('savedAddresses');
        if (!container) return;

        let addresses = [];
        try {
            addresses = JSON.parse(localStorage.getItem('480_saved_addresses') || '[]');
        } catch (_error) {
            addresses = [];
        }

        if (!addresses.length) return;

        container.style.display = 'flex';
        container.innerHTML = addresses.map((address, index) => `
            <label class="address-option">
                <input type="radio" name="savedAddress" value="${index}">
                <div class="address-option-info">
                    <strong>${address.name}</strong>
                    <span>${address.address}, ${address.city} (${address.province})</span>
                </div>
            </label>
        `).join('');

        container.querySelectorAll('input[name="savedAddress"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const selected = addresses[Number(radio.value)];
                if (selected) {
                    this.fillAddressFields(selected);
                    const useNewAddress = document.getElementById('useNewAddress');
                    if (useNewAddress) useNewAddress.checked = false;
                    this.toggleShippingFields(false);
                }
            });
        });
    }

    fillAddressFields(address) {
        const mapping = {
            shipName: address.name,
            shipEmail: address.email,
            shipPhone: address.phone,
            shipProvince: address.province,
            shipCity: address.city,
            shipPostalCode: address.postal_code,
            shipStreet: address.address,
            shipApartment: address.apartment,
            shipInstructions: address.instructions
        };

        Object.entries(mapping).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field) field.value = value || '';
        });
    }

    toggleShippingFields(show) {
        const fields = document.getElementById('shippingFields');
        if (fields) fields.style.display = show ? 'grid' : 'none';
    }

    setupListeners() {
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const confirmBtn = document.getElementById('confirmPurchaseBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.goToStep(this.currentStep - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.handleNextStep());
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.handleConfirmPurchase());

        const useNewAddress = document.getElementById('useNewAddress');
        if (useNewAddress) {
            useNewAddress.addEventListener('change', () => this.toggleShippingFields(useNewAddress.checked));
        }

        const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.selectedPaymentMethod = radio.value;
                this.renderSummary();
            });
        });

        const installmentSelect = document.getElementById('installmentsSelect');
        if (installmentSelect) {
            installmentSelect.addEventListener('change', () => {
                this.selectedInstallments = Number(installmentSelect.value);
            });
        }

        const shippingSelect = document.getElementById('shippingMethodSelect');
        if (shippingSelect) {
            shippingSelect.addEventListener('change', () => {
                this.selectedShippingMethod = shippingSelect.value;
                this.updateShippingNote();
                this.renderSummary();
            });
        }
    }

    updateShippingNote() {
        const method = ordersService.getShippingMethod(this.selectedShippingMethod);
        const note = document.getElementById('shippingNote');
        if (note) {
            note.textContent = `Envío ${method.label}: ${method.days} · ${formatearMoneda(method.cost)}`;
        }
    }

    showGlobalError(message) {
        const el = document.getElementById('checkoutError');
        if (!el) return;
        el.textContent = message;
        el.style.display = 'block';
    }

    clearGlobalError() {
        const el = document.getElementById('checkoutError');
        if (!el) return;
        el.style.display = 'none';
        el.textContent = '';
    }

    getShippingAddressFromForm() {
        return {
            name: document.getElementById('shipName')?.value.trim(),
            email: document.getElementById('shipEmail')?.value.trim(),
            phone: document.getElementById('shipPhone')?.value.trim(),
            province: document.getElementById('shipProvince')?.value.trim(),
            city: document.getElementById('shipCity')?.value.trim(),
            postal_code: document.getElementById('shipPostalCode')?.value.trim(),
            address: document.getElementById('shipStreet')?.value.trim(),
            apartment: document.getElementById('shipApartment')?.value.trim(),
            instructions: document.getElementById('shipInstructions')?.value.trim()
        };
    }

    validateStep(step) {
        try {
            if (step === 1) {
                const address = this.getShippingAddressFromForm();
                ordersService.validateShippingAddress(address);
            }
            if (step === 2) {
                ordersService.validatePaymentMethod({ method: this.selectedPaymentMethod });
            }
            return true;
        } catch (error) {
            this.showGlobalError(error.message);
            return false;
        }
    }

    handleNextStep() {
        if (!this.validateStep(this.currentStep)) return;
        this.goToStep(Math.min(this.currentStep + 1, this.maxStep));
    }

    goToStep(step) {
        if (step < 1 || step > this.maxStep) return;

        this.currentStep = step;
        this.clearGlobalError();

        document.querySelectorAll('.checkout-step-panel').forEach(panel => {
            panel.classList.toggle('active', Number(panel.dataset.stepPanel) === step);
        });

        document.querySelectorAll('.checkout-step').forEach(node => {
            const stepNum = Number(node.dataset.step);
            node.classList.toggle('active', stepNum === step);
            node.classList.toggle('done', stepNum < step);
        });

        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');

        if (prevBtn) prevBtn.disabled = step === 1;
        if (nextBtn) nextBtn.style.display = step === 4 ? 'none' : 'inline-flex';

        if (step === 3) {
            this.renderReview();
        }
    }

    calculateTotals() {
        const subtotal = carritoService.obtenerTotal();
        const discount = this.couponInfo?.amount || 0;
        const taxableBase = Math.max(subtotal - discount, 0);
        const tax = Math.round(taxableBase * 0.21);
        const shippingMethod = ordersService.getShippingMethod(this.selectedShippingMethod);
        const total = taxableBase + tax + shippingMethod.cost;

        return { subtotal, discount, tax, shipping: shippingMethod.cost, total };
    }

    renderSummary() {
        const summaryContainer = document.getElementById('summaryItems');
        if (!summaryContainer) return;

        summaryContainer.innerHTML = this.items.map(item => `
            <div class="summary-item">
                <img src="${item.imagen || ''}" alt="${item.nombre}" class="summary-item-img" onerror="this.src='https://via.placeholder.com/56x56?text=📦'">
                <div class="summary-item-info">
                    <div class="summary-item-name">${item.nombre}</div>
                    <div class="summary-item-qty">Cant: ${item.cantidad}</div>
                </div>
                <span class="summary-item-price">${formatearMoneda(item.precio * item.cantidad)}</span>
            </div>
        `).join('');

        const totals = this.calculateTotals();
        document.getElementById('subtotalAmount').textContent = formatearMoneda(totals.subtotal);
        document.getElementById('taxAmount').textContent = formatearMoneda(totals.tax);
        document.getElementById('shippingAmount').textContent = formatearMoneda(totals.shipping);
        document.getElementById('grandTotal').textContent = formatearMoneda(totals.total);

        const discountRow = document.getElementById('discountRow');
        if (totals.discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('discountLabel').textContent = this.couponInfo.label;
            document.getElementById('discountAmount').textContent = `- ${formatearMoneda(totals.discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    renderReview() {
        const review = document.getElementById('checkoutReview');
        if (!review) return;

        const address = this.getShippingAddressFromForm();
        const paymentLabel = {
            mercadopago: 'Tarjeta por MercadoPago',
            transfer: 'Transferencia bancaria',
            cash_on_delivery: 'Efectivo contra entrega'
        }[this.selectedPaymentMethod] || 'No definido';

        const totals = this.calculateTotals();

        review.innerHTML = `
            <table class="checkout-review-table">
                <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th></tr></thead>
                <tbody>
                    ${this.items.map(item => `
                        <tr>
                            <td>${item.nombre}</td>
                            <td>${item.cantidad}</td>
                            <td>${formatearMoneda(item.precio * item.cantidad)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="checkout-review-meta">
                <div>
                    <h4>Dirección</h4>
                    <p>${address.name}</p>
                    <p>${address.address}${address.apartment ? `, ${address.apartment}` : ''}</p>
                    <p>${address.city}, ${address.province} (${address.postal_code})</p>
                    <p>${address.phone} · ${address.email}</p>
                </div>
                <div>
                    <h4>Pago</h4>
                    <p>${paymentLabel}</p>
                    <p>${this.selectedInstallments} cuota(s)</p>
                    <p>Envío: ${ordersService.getShippingMethod(this.selectedShippingMethod).label}</p>
                </div>
            </div>

            <div class="checkout-review-totals">
                <p>Subtotal: <strong>${formatearMoneda(totals.subtotal)}</strong></p>
                <p>IVA: <strong>${formatearMoneda(totals.tax)}</strong></p>
                ${totals.discount > 0 ? `<p>${this.couponInfo.label}: <strong>- ${formatearMoneda(totals.discount)}</strong></p>` : ''}
                <p>Envío: <strong>${formatearMoneda(totals.shipping)}</strong></p>
                <p>Total: <strong>${formatearMoneda(totals.total)}</strong></p>
            </div>
        `;
    }

    saveAddressIfNeeded(address) {
        const shouldSave = document.getElementById('saveAddressCheckbox')?.checked;
        if (!shouldSave) return;

        let addresses = [];
        try {
            addresses = JSON.parse(localStorage.getItem('480_saved_addresses') || '[]');
        } catch (_error) {
            addresses = [];
        }

        const exists = addresses.some(item => item.address === address.address && item.postal_code === address.postal_code);
        if (!exists) {
            addresses.unshift(address);
            localStorage.setItem('480_saved_addresses', JSON.stringify(addresses.slice(0, 5)));
        }
    }

    async handleConfirmPurchase() {
        if (!this.validateStep(1) || !this.validateStep(2)) return;

        const termsAccepted = document.getElementById('termsCheckbox')?.checked;
        if (!termsAccepted) {
            this.showGlobalError('Debés aceptar los términos y condiciones para continuar.');
            return;
        }

        const tokenInForm = document.getElementById('csrfToken')?.value;
        const tokenInSession = sessionStorage.getItem('480_checkout_csrf');
        if (!tokenInForm || tokenInForm !== tokenInSession) {
            this.showGlobalError('Sesión inválida. Recargá la página e intentá nuevamente.');
            return;
        }

        const btn = document.getElementById('confirmPurchaseBtn');
        const loading = document.getElementById('checkoutLoading');
        btn.disabled = true;
        loading.style.display = 'block';
        this.clearGlobalError();

        try {
            const address = this.getShippingAddressFromForm();
            const payment = {
                method: this.selectedPaymentMethod,
                installments: this.selectedInstallments
            };

            const order = ordersService.createOrder({
                user: this.user,
                shippingAddress: address,
                payment,
                shippingMethod: this.selectedShippingMethod,
                items: this.items,
                couponCode: this.couponCode
            });

            this.saveAddressIfNeeded(address);

            if (payment.method === 'mercadopago') {
                const preference = mercadoPagoService.createPaymentPreference({
                    order,
                    payer: { email: address.email, name: address.name },
                    shipment: order.shipment,
                    metadata: { flow: 'checkout-web' },
                    backUrls: {
                        success: 'order-confirmation.html',
                        failure: 'order-confirmation.html?payment_status=rejected',
                        pending: 'order-confirmation.html?payment_status=pending'
                    }
                });

                mercadoPagoService.redirectToPayment(preference);
                return;
            }

            const approvedStatus = payment.method === 'transfer' ? 'processing' : 'completed';
            const paymentStatus = payment.method === 'transfer' ? 'pending' : 'approved';

            ordersService.updateOrderStatus(order.order_id, approvedStatus, {
                status: paymentStatus,
                installments: this.selectedInstallments,
                card_last_four: null
            });

            await emailService.sendOrderConfirmation(order);
            if (paymentStatus === 'approved') {
                await emailService.sendPaymentConfirmed({
                    ...order,
                    payment: { ...order.payment, status: paymentStatus, paid_at: new Date().toISOString() }
                });
            }

            carritoService.vaciar();
            window.location.href = `order-confirmation.html?order_id=${encodeURIComponent(order.order_id)}`;
        } catch (error) {
            console.error('Error en checkout:', error);
            this.showGlobalError(error.message || 'Ocurrió un error al procesar la compra');
            btn.disabled = false;
            loading.style.display = 'none';
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CheckoutComponent());
} else {
    new CheckoutComponent();
}
