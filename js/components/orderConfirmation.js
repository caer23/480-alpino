/**
 * COMPONENTE: CONFIRMACIÓN DE ORDEN
 */

class OrderConfirmationComponent {
    constructor() {
        const params = new URLSearchParams(window.location.search);
        this.orderId = params.get('order_id');
        this.paymentStatus = params.get('payment_status');
        this.paymentId = params.get('payment_id');
        this.root = document.getElementById('orderConfirmationRoot');
        this.order = null;
        this.init();
    }

    async init() {
        if (!this.orderId) {
            this.renderError('No encontramos el número de orden.');
            return;
        }

        this.order = ordersService.getOrder(this.orderId);
        if (!this.order) {
            this.renderError('La orden no existe o expiró la sesión.');
            return;
        }

        this.syncPaymentStatus();
        await this.trySendEmails();
        this.render();
    }

    syncPaymentStatus() {
        if (!this.paymentStatus) return;

        const status = mercadoPagoService.validatePaymentStatus(this.paymentStatus);

        if (status.isApproved) {
            this.order = ordersService.updateOrderStatus(this.order.order_id, 'completed', {
                status: 'approved',
                mercadopago_id: this.paymentId || this.order.payment.mercadopago_id,
                installments: this.order.payment.installments,
                card_last_four: this.order.payment.card_last_four || '4111'
            });
            if (typeof carritoService !== 'undefined') {
                carritoService.vaciar();
            }
        } else if (status.isRejected) {
            this.order = ordersService.updateOrderStatus(this.order.order_id, 'rejected', {
                status: 'rejected',
                mercadopago_id: this.paymentId || this.order.payment.mercadopago_id
            });
        } else if (status.isPending && this.order.status === 'pending') {
            this.order = ordersService.updateOrderStatus(this.order.order_id, 'processing', {
                status: 'pending',
                mercadopago_id: this.paymentId || this.order.payment.mercadopago_id
            });
        }
    }

    async trySendEmails() {
        if (!this.order) return;

        const hasConfirmation = this.order.email_confirmation_sent;
        const hasPaymentMail = this.order.email_payment_sent;

        if (!hasConfirmation) {
            await emailService.sendOrderConfirmation(this.order);
            this.order.email_confirmation_sent = true;
        }

        if (this.order.payment.status === 'approved' && !hasPaymentMail) {
            await emailService.sendPaymentConfirmed(this.order);
            this.order.email_payment_sent = true;
        }

        const allOrders = ordersService.getOrders();
        const index = allOrders.findIndex(order => order.order_id === this.order.order_id);
        if (index >= 0) {
            allOrders[index] = this.order;
            ordersService.saveOrders(allOrders);
        }
    }

    getStatusLabel() {
        const mapping = {
            completed: { icon: '✅', text: '¡Compra confirmada!' },
            processing: { icon: '⏳', text: 'Pago en revisión' },
            pending: { icon: '⏳', text: 'Compra pendiente' },
            rejected: { icon: '❌', text: 'Pago rechazado' }
        };
        return mapping[this.order.status] || mapping.pending;
    }

    renderError(message) {
        if (!this.root) return;
        this.root.innerHTML = `
            <section class="order-confirmation-card">
                <h1>${message}</h1>
                <a href="../index.html" class="oc-btn">Volver al inicio</a>
            </section>
        `;
    }

    render() {
        if (!this.root || !this.order) return;

        const status = this.getStatusLabel();
        const paymentMethodLabel = {
            mercadopago: 'MercadoPago',
            transfer: 'Transferencia bancaria',
            cash_on_delivery: 'Efectivo contra entrega'
        }[this.order.payment.method] || this.order.payment.method;

        this.root.innerHTML = `
            <section class="order-confirmation-card">
                <div class="oc-status-icon">${status.icon}</div>
                <h1>${status.text}</h1>
                <p>Número de orden: <strong>${this.order.order_id}</strong></p>
                <p>Email de confirmación enviado a <strong>${this.order.user_email}</strong>.</p>

                <div class="oc-grid">
                    <article class="oc-block">
                        <h2>Resumen de compra</h2>
                        <ul class="oc-items">
                            ${this.order.items.map(item => `
                                <li>
                                    <span>${item.name} × ${item.quantity}</span>
                                    <strong>${formatearMoneda(item.subtotal)}</strong>
                                </li>
                            `).join('')}
                        </ul>
                        <p>Subtotal: <strong>${formatearMoneda(this.order.subtotal)}</strong></p>
                        <p>IVA: <strong>${formatearMoneda(this.order.tax)}</strong></p>
                        ${this.order.discount ? `<p>Descuento: <strong>- ${formatearMoneda(this.order.discount)}</strong></p>` : ''}
                        <p>Total: <strong>${formatearMoneda(this.order.total)}</strong></p>
                    </article>

                    <article class="oc-block">
                        <h2>Envío</h2>
                        <p>${this.order.shipping_address.name}</p>
                        <p>${this.order.shipping_address.address}${this.order.shipping_address.apartment ? `, ${this.order.shipping_address.apartment}` : ''}</p>
                        <p>${this.order.shipping_address.city}, ${this.order.shipping_address.province}</p>
                        <p>CP: ${this.order.shipping_address.postal_code}</p>
                        <p>Método: <strong>${this.order.shipment.method}</strong></p>
                        <p>Entrega estimada: <strong>${this.order.shipment.estimated_delivery}</strong></p>
                        <p>Seguimiento: <a href="${this.getTrackingUrl()}" target="_blank" rel="noopener">${this.order.shipment.tracking_number || 'Se asignará al despachar'}</a></p>
                    </article>

                    <article class="oc-block">
                        <h2>Pago</h2>
                        <p>Método: <strong>${paymentMethodLabel}</strong></p>
                        <p>Estado: <strong>${this.order.payment.status}</strong></p>
                        ${this.order.payment.card_last_four ? `<p>Tarjeta terminada en: <strong>${this.order.payment.card_last_four}</strong></p>` : ''}
                        <p>Cuotas: <strong>${this.order.payment.installments}</strong></p>
                        <p>ID transacción: <strong>${this.order.payment.mercadopago_id || 'Pendiente'}</strong></p>
                    </article>
                </div>

                <section class="oc-next-steps">
                    <h2>Próximos pasos</h2>
                    <ul>
                        ${(this.order.next_steps || []).map(step => `<li>${step}</li>`).join('')}
                    </ul>
                    <p>Vendedor: <strong>Cota 480 Oficial</strong> · soporte@cota480.com</p>
                </section>

                <div class="oc-actions">
                    <a class="oc-btn" href="${this.getTrackingUrl()}" target="_blank" rel="noopener">Rastrear pedido</a>
                    <a class="oc-btn secondary" href="user-profile.html">Ver mi perfil</a>
                    <a class="oc-btn secondary" href="../index.html">Continuar comprando</a>
                </div>
            </section>
        `;
    }

    getTrackingUrl() {
        const tracking = this.order?.shipment?.tracking_number;
        if (!tracking) return '#';
        return `https://www.oca.com.ar/seguimiento?pieza=${encodeURIComponent(tracking)}`;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new OrderConfirmationComponent());
} else {
    new OrderConfirmationComponent();
}
