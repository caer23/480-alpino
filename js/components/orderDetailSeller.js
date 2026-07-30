/**
 * COMPONENTE: DETALLE DE PEDIDO VENDEDOR
 */
class OrderDetailSellerComponent {
    constructor() {
        this.root = document.getElementById('orderDetailSellerApp');
        this.orderId = new URLSearchParams(window.location.search).get('order_id');
        this.order = null;
        this.init();
    }

    init() {
        if (!this.root) return;
        this.order = orderManagementService.getOrderDetail(this.orderId);
        if (!this.order) {
            this.root.innerHTML = '<div class="orders-empty-state">No encontramos la venta solicitada.</div>';
            return;
        }
        this.render();
        this.bind();
    }

    getActionsForStatus() {
        const status = this.order.status;
        if (status === 'paid') {
            return `
                <button type="button" class="orders-primary-btn" data-action="confirm">Confirmar pedido</button>
                <button type="button" class="orders-outline-btn danger" data-action="cancel">Rechazar / Cancelar</button>
                <p class="detail-help">Tenés 24 horas para confirmar el pedido.</p>
            `;
        }
        if (status === 'confirmed') {
            return `
                <button type="button" class="orders-primary-btn" data-action="preparing">Marcar como preparando</button>
                <p class="detail-help">Preparate para coordinar el envío.</p>
            `;
        }
        if (status === 'preparing') {
            return `
                <button type="button" class="orders-primary-btn" data-action="ready">Marcar como listo para enviar</button>
                <button type="button" class="orders-outline-btn" data-action="label">Generar etiqueta de envío</button>
                <p class="detail-help">Producto listo, ahora cargá el tracking del carrier.</p>
            `;
        }
        if (status === 'ready_to_ship') {
            return `
                <div class="tracking-form-inline">
                    <input type="text" id="sellerTrackingNumber" placeholder="Número de seguimiento">
                    <select id="sellerCarrier"><option value="OCA">OCA</option><option value="Andreani">Andreani</option><option value="Correo Argentino">Correo Argentino</option></select>
                </div>
                <button type="button" class="orders-primary-btn" data-action="ship">Confirmar envío</button>
                <button type="button" class="orders-outline-btn" data-action="label">Descargar etiqueta</button>
            `;
        }
        if (status === 'shipped') {
            return `
                <p class="detail-help">Tracking: <strong>${this.order.shipment.tracking_number || 'Pendiente'}</strong></p>
                <button type="button" class="orders-outline-btn" data-action="track">Ver seguimiento</button>
                <button type="button" class="orders-primary-btn" data-action="deliver">Marcar como entregado</button>
            `;
        }
        if (status === 'delivered') {
            return `
                <p class="detail-help">Entrega confirmada ${this.order.shipment.delivered_at ? new Date(this.order.shipment.delivered_at).toLocaleString('es-AR') : ''}</p>
                <p class="detail-help">Review comprador: ${this.order.review || 'Aún sin review.'}</p>
            `;
        }
        return `<p class="detail-help">Estado actual: ${this.order.status_label}</p>`;
    }

    bind() {
        this.root.addEventListener('click', (event) => {
            const action = event.target.dataset.action;
            if (!action) return;
            if (action === 'confirm') orderManagementService.confirmOrder(this.order.order_id);
            if (action === 'preparing') orderManagementService.updateOrderStatus(this.order.order_id, 'preparing');
            if (action === 'ready') orderManagementService.updateOrderStatus(this.order.order_id, 'ready_to_ship');
            if (action === 'deliver') orderManagementService.updateOrderStatus(this.order.order_id, 'delivered');
            if (action === 'cancel') {
                const reason = window.prompt('Motivo de cancelación', 'Sin stock confirmado');
                if (reason) orderManagementService.cancelOrder(this.order.order_id, reason);
            }
            if (action === 'ship') {
                const number = document.getElementById('sellerTrackingNumber')?.value.trim();
                const carrier = document.getElementById('sellerCarrier')?.value || 'OCA';
                if (!number) {
                    NotificacionesComponent?.mostrar?.('Ingresá un número de seguimiento.', 'warning');
                    return;
                }
                orderManagementService.addTrackingNumber(this.order.order_id, number, carrier);
            }
            if (action === 'label') {
                NotificacionesComponent?.mostrar?.('Etiqueta lista para descargar. Verificá tu bandeja de correo o historial.', 'info');
            }
            if (action === 'track' && this.order.shipment.tracking_url) {
                window.open(this.order.shipment.tracking_url, '_blank', 'noopener');
            }
            this.order = orderManagementService.getOrderDetail(this.orderId);
            this.render();
        });

        this.root.addEventListener('submit', (event) => {
            if (event.target.id !== 'sellerMessageForm') return;
            event.preventDefault();
            const input = event.target.querySelector('textarea');
            const text = input.value.trim();
            if (!text) return;
            messagingService.sendMessage(this.order.order_id, text, 'seller');
            input.value = '';
            this.order = orderManagementService.getOrderDetail(this.orderId);
            this.render();
        });
    }

    render() {
        const messages = messagingService.getMessages(this.order.order_id);
        const platformFee = Math.round(this.order.total * 0.12);
        this.root.innerHTML = `
            <section class="order-detail-page seller-page-detail">
                <header class="order-detail-header">
                    <div>
                        <p class="orders-page-kicker">Venta ${this.order.order_id}</p>
                        <h1>Detalle de pedido vendedor</h1>
                    </div>
                    <span class="status-badge large" style="--badge-color:${this.order.status_meta.color}">${this.order.status_label}</span>
                </header>
                <div class="timeline-strip seller-actions-strip">${this.getActionsForStatus()}</div>
                <div class="order-detail-grid seller-detail-grid">
                    <div class="order-detail-main">
                        <article class="detail-card">
                            <h2>Datos del comprador</h2>
                            <div class="detail-meta-grid">
                                <div><span>Nombre</span><strong>${this.order.buyer.name}</strong></div>
                                <div><span>Email</span><strong><a class="orders-link" href="mailto:${this.order.buyer.email}">${this.order.buyer.email}</a></strong></div>
                                <div><span>Teléfono</span><strong><a class="orders-link" href="https://wa.me/${(this.order.buyer.phone || '').replace(/\D/g, '')}" target="_blank" rel="noopener">${this.order.buyer.phone || 'Sin informar'}</a></strong></div>
                                <div><span>Dirección</span><strong>${this.order.shipping_address.address}, ${this.order.shipping_address.city}</strong></div>
                            </div>
                            <p class="detail-help">Instrucciones especiales: ${this.order.shipping_address.instructions || 'No indicó observaciones.'}</p>
                        </article>
                        <article class="detail-card">
                            <h2>Listado de productos</h2>
                            <table class="detail-table">
                                <thead><tr><th>Producto</th><th>Talle</th><th>Cant.</th><th>Precio</th></tr></thead>
                                <tbody>${this.order.items.map(item => `
                                    <tr>
                                        <td><div class="order-product-cell compact"><img src="${item.imagen}" alt="${item.name}"><span>${item.name}</span></div></td>
                                        <td>${item.talle}</td>
                                        <td>${item.quantity}</td>
                                        <td>${formatearMoneda(item.subtotal)}</td>
                                    </tr>
                                `).join('')}</tbody>
                            </table>
                            <div class="detail-totals"><p class="grand"><span>Total orden</span><strong>${formatearMoneda(this.order.total)}</strong></p></div>
                        </article>
                        <article class="detail-card">
                            <h2>Timeline de acciones</h2>
                            <div class="detail-events">
                                ${this.order.status_history.map(item => `
                                    <div class="detail-event-item">
                                        <strong>${orderManagementService.getStatusMeta(item.status).label}</strong>
                                        <span>${item.message}</span>
                                        <small>${new Date(item.timestamp).toLocaleString('es-AR')}</small>
                                    </div>
                                `).join('')}
                            </div>
                        </article>
                        <article class="detail-card" id="chat">
                            <h2>Chat / Mensajes</h2>
                            <div class="chat-thread">
                                ${messages.map(message => `
                                    <div class="chat-bubble ${message.from_type === 'seller' ? 'seller' : 'buyer'}">
                                        <strong>${message.from_type === 'seller' ? 'Vos' : this.order.buyer.name}</strong>
                                        <p>${message.content}</p>
                                        <small>${new Date(message.timestamp).toLocaleString('es-AR')}</small>
                                    </div>
                                `).join('')}
                            </div>
                            <form id="sellerMessageForm" class="chat-form">
                                <textarea rows="3" placeholder="Escribile al comprador"></textarea>
                                <button type="submit" class="orders-primary-btn">Enviar mensaje</button>
                            </form>
                        </article>
                    </div>
                    <aside class="order-detail-side">
                        <article class="detail-card">
                            <h2>Información de pago</h2>
                            <div class="detail-meta-grid">
                                <div><span>Monto orden</span><strong>${formatearMoneda(this.order.total)}</strong></div>
                                <div><span>Comisión plataforma</span><strong>${formatearMoneda(platformFee)} (12%)</strong></div>
                                <div><span>Monto a cobrar</span><strong>${formatearMoneda(this.order.total - platformFee)}</strong></div>
                                <div><span>Estado</span><strong>${this.order.payment.status}</strong></div>
                            </div>
                            <p class="detail-help">Fecha estimada de pago: dentro de 48 hs hábiles luego de la entrega.</p>
                        </article>
                        <article class="detail-card">
                            <h2>Acciones rápidas</h2>
                            <div class="orders-action-grid">
                                <button type="button" class="orders-outline-btn" data-action="label">Descargar etiqueta</button>
                                <button type="button" class="orders-outline-btn danger" data-action="cancel">Cancelar pedido</button>
                                <button type="button" class="orders-outline-btn">Reportar problema</button>
                            </div>
                        </article>
                        <article class="detail-card">
                            <h2>Información</h2>
                            <p>Política de cambios: ${this.order.seller.policy}</p>
                            <p>Términos de venta: los envíos deben confirmarse con tracking válido y contacto activo con el comprador.</p>
                        </article>
                    </aside>
                </div>
            </section>
        `;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new OrderDetailSellerComponent());
} else {
    new OrderDetailSellerComponent();
}
