/**
 * COMPONENTE: DETALLE DE PEDIDO COMPRADOR
 */
class OrderDetailBuyerComponent {
    constructor() {
        this.root = document.getElementById('orderDetailBuyerApp');
        this.orderId = new URLSearchParams(window.location.search).get('order_id');
        this.order = null;
        this.init();
    }

    init() {
        if (!this.root) return;
        this.order = orderManagementService.getOrderDetail(this.orderId);
        if (!this.order) {
            this.root.innerHTML = '<div class="orders-empty-state">No encontramos el pedido solicitado.</div>';
            return;
        }
        this.render();
        this.bindActions();
    }

    getTimeline() {
        return orderManagementService.timelineOrder.map(step => ({
            key: step,
            meta: orderManagementService.getStatusMeta(step),
            done: this.order.status_history.some(item => item.status === step),
            current: this.order.status === step
        }));
    }

    bindActions() {
        this.root.addEventListener('click', (event) => {
            const action = event.target.dataset.action;
            if (!action) return;
            if (action === 'track' && this.order.shipment.tracking_url) {
                window.open(this.order.shipment.tracking_url, '_blank', 'noopener');
            }
            if (action === 'return') {
                window.location.href = `return-request.html?order_id=${encodeURIComponent(this.order.order_id)}`;
            }
            if (action === 'reorder') {
                if (orderManagementService.reorder(this.order.order_id)) {
                    NotificacionesComponent?.mostrar?.('El pedido se agregó nuevamente al carrito.', 'success');
                }
            }
            if (action === 'contact') {
                window.location.href = `order-detail-seller.html?order_id=${encodeURIComponent(this.order.order_id)}#chat`;
            }
            if (action === 'invoice') {
                NotificacionesComponent?.mostrar?.('La factura estará disponible en tu email y en el historial de la orden.', 'info');
            }
        });
    }

    render() {
        const tracking = trackingService.getTrackingInfo(this.order.shipment.tracking_number, this.order.shipment.carrier);
        this.root.innerHTML = `
            <section class="order-detail-page">
                <header class="order-detail-header">
                    <div>
                        <p class="orders-page-kicker">Pedido ${this.order.order_id}</p>
                        <h1>Detalle de compra</h1>
                        <p>Realizado el ${new Date(this.order.order_date).toLocaleDateString('es-AR')}.</p>
                    </div>
                    <span class="status-badge large" style="--badge-color:${this.order.status_meta.color}">${this.order.status_label}</span>
                </header>
                <div class="timeline-strip">
                    ${this.getTimeline().map(step => `
                        <div class="timeline-step ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}">
                            <span>${step.done ? '✓' : '→'}</span>
                            <strong>${step.meta.label}</strong>
                        </div>
                    `).join('')}
                </div>
                <div class="order-detail-grid">
                    <div class="order-detail-main">
                        <article class="detail-card">
                            <h2>Resumen de productos</h2>
                            <table class="detail-table">
                                <thead><tr><th>Producto</th><th>Talle</th><th>Cant.</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
                                <tbody>
                                    ${this.order.items.map(item => `
                                        <tr>
                                            <td>
                                                <a href="${item.link}" class="order-product-cell compact">
                                                    <img src="${item.imagen}" alt="${item.name}">
                                                    <span>${item.name}</span>
                                                </a>
                                            </td>
                                            <td>${item.talle}</td>
                                            <td>${item.quantity}</td>
                                            <td>${formatearMoneda(item.unit_price)}</td>
                                            <td>${formatearMoneda(item.subtotal)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <div class="detail-totals">
                                <p><span>Subtotal</span><strong>${formatearMoneda(this.order.subtotal)}</strong></p>
                                <p><span>Impuestos</span><strong>${formatearMoneda(this.order.tax)}</strong></p>
                                <p><span>Envío</span><strong>${formatearMoneda(this.order.shipping_cost)}</strong></p>
                                <p><span>Descuento</span><strong>- ${formatearMoneda(this.order.discount)}</strong></p>
                                <p class="grand"><span>Total</span><strong>${formatearMoneda(this.order.total)}</strong></p>
                            </div>
                        </article>
                        <article class="detail-card">
                            <h2>Información de envío</h2>
                            <div class="detail-meta-grid">
                                <div><span>Dirección</span><strong>${this.order.shipping_address.address}, ${this.order.shipping_address.city}</strong></div>
                                <div><span>Método</span><strong>${this.order.shipment.method}</strong></div>
                                <div><span>Estimado</span><strong>${this.order.shipment.estimated_delivery}</strong></div>
                                <div><span>Tracking</span><strong>${this.order.shipment.tracking_number || 'Se asignará al despachar'}</strong></div>
                            </div>
                            <button type="button" class="orders-primary-btn" data-action="track">Rastrear en ${this.order.shipment.carrier}</button>
                            <div class="detail-events">
                                ${(tracking.events.length ? tracking.events : this.order.status_history).map(event => `
                                    <div class="detail-event-item">
                                        <strong>${event.status.replace(/_/g, ' ')}</strong>
                                        <span>${event.location || event.message || 'Actualización del pedido'}</span>
                                        <small>${new Date(event.timestamp).toLocaleString('es-AR')}</small>
                                    </div>
                                `).join('')}
                            </div>
                        </article>
                        <article class="detail-card">
                            <h2>Información de pago</h2>
                            <div class="detail-meta-grid">
                                <div><span>Método</span><strong>${this.order.payment.method}</strong></div>
                                <div><span>Tarjeta</span><strong>${this.order.payment.card_last_four ? `**** ${this.order.payment.card_last_four}` : 'No aplica'}</strong></div>
                                <div><span>Cuotas</span><strong>${this.order.payment.installments}</strong></div>
                                <div><span>Estado</span><strong>${this.order.payment.status}</strong></div>
                            </div>
                        </article>
                    </div>
                    <aside class="order-detail-side">
                        <article class="detail-card seller-card">
                            <h2>Datos del vendedor</h2>
                            <div class="seller-box">
                                <div class="seller-avatar">${this.order.seller.logo}</div>
                                <div>
                                    <strong>${this.order.seller.name}</strong>
                                    <p>⭐ ${this.order.seller.rating} · Responde en ${this.order.seller.response}</p>
                                </div>
                            </div>
                            <button type="button" class="orders-outline-btn" data-action="contact">Contactar vendedor</button>
                            <p class="seller-policy">${this.order.seller.policy}</p>
                        </article>
                        <article class="detail-card">
                            <h2>Acciones</h2>
                            <div class="orders-action-grid">
                                ${this.order.status === 'delivered' ? '<button type="button" class="orders-primary-btn">Calificar</button>' : ''}
                                <button type="button" class="orders-outline-btn" data-action="invoice">Descargar factura</button>
                                <button type="button" class="orders-outline-btn" data-action="return">Devolver / Cambiar</button>
                                <button type="button" class="orders-outline-btn" data-action="reorder">Comprar de nuevo</button>
                            </div>
                        </article>
                        <article class="detail-card">
                            <h2>Preguntas frecuentes</h2>
                            <div class="faq-list compact">
                                <details open><summary>¿Cómo rastreo mi pedido?</summary><p>Usá el botón de tracking o el número de seguimiento informado por ${this.order.shipment.carrier}.</p></details>
                                <details><summary>¿Qué hago si no llega?</summary><p>Contactanos desde este pedido y revisamos la gestión con el transportista.</p></details>
                                <details><summary>¿Cómo devuelvo?</summary><p>Ingresá a “Devolver / Cambiar” y cargá la solicitud con motivo y evidencia.</p></details>
                            </div>
                        </article>
                    </aside>
                </div>
            </section>
        `;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new OrderDetailBuyerComponent());
} else {
    new OrderDetailBuyerComponent();
}
