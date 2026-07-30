/**
 * COMPONENTE: SOLICITUD DE DEVOLUCIÓN / CAMBIO
 */
class ReturnRequestComponent {
    constructor() {
        this.root = document.getElementById('returnRequestApp');
        this.orderId = new URLSearchParams(window.location.search).get('order_id');
        this.order = orderManagementService.getOrderDetail(this.orderId);
        this.init();
    }

    init() {
        if (!this.root) return;
        if (!this.order) {
            this.root.innerHTML = '<div class="orders-empty-state">No encontramos el pedido para gestionar la devolución.</div>';
            return;
        }
        this.render();
        this.bind();
    }

    bind() {
        this.root.addEventListener('change', (event) => {
            if (event.target.name === 'requestType') {
                const isExchange = event.target.value === 'exchange';
                document.getElementById('replacementWrap').style.display = isExchange ? 'block' : 'none';
                document.getElementById('refundWrap').style.display = isExchange ? 'none' : 'block';
            }
            if (event.target.id === 'returnReason') {
                document.getElementById('otherReasonWrap').style.display = event.target.value === 'Otro' ? 'block' : 'none';
            }
        });
        this.root.addEventListener('submit', (event) => {
            if (event.target.id !== 'returnRequestForm') return;
            event.preventDefault();
            const terms = document.getElementById('returnTerms').checked;
            if (!terms) {
                NotificacionesComponent?.mostrar?.('Debés aceptar los términos de devolución.', 'warning');
                return;
            }
            const files = Array.from(document.getElementById('returnEvidence').files || []).map(file => file.name);
            const requestType = document.querySelector('input[name="requestType"]:checked')?.value || 'refund';
            orderManagementService.requestReturn(this.order.order_id, {
                reason: document.getElementById('returnReason').value,
                description: document.getElementById('returnDescription').value.trim(),
                images: files,
                requestType,
                replacementProductId: requestType === 'exchange' ? document.getElementById('replacementProduct').value : '',
                refund_amount: this.order.total,
                extraReason: document.getElementById('returnOtherReason').value.trim()
            });
            NotificacionesComponent?.mostrar?.('Tu solicitud fue enviada con éxito.', 'success');
            window.location.href = `order-detail-buyer.html?order_id=${encodeURIComponent(this.order.order_id)}`;
        });
    }

    render() {
        this.root.innerHTML = `
            <section class="return-page">
                <header class="order-detail-header">
                    <div>
                        <p class="orders-page-kicker">Pedido ${this.order.order_id}</p>
                        <h1>Solicitar devolución / cambio</h1>
                        <p>Cargá el motivo, evidencia y cómo querés resolver el pedido.</p>
                    </div>
                </header>
                <div class="return-layout">
                    <article class="detail-card return-product-card">
                        <h2>Producto a devolver</h2>
                        ${this.order.items.map(item => `
                            <div class="order-product-cell compact return-product-row">
                                <img src="${item.imagen}" alt="${item.name}">
                                <div>
                                    <strong>${item.name}</strong>
                                    <p>${item.talle} · Cantidad ${item.quantity}</p>
                                    <span>${formatearMoneda(item.subtotal)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </article>
                    <form id="returnRequestForm" class="detail-card return-form">
                        <h2>Datos de la solicitud</h2>
                        <label>Motivo
                            <select id="returnReason" required>
                                <option>No me gustó</option>
                                <option>Defecto/Daño</option>
                                <option>No es lo que esperaba</option>
                                <option>Talle incorrecto</option>
                                <option>Cambio de opinión</option>
                                <option>Otro</option>
                            </select>
                        </label>
                        <label id="otherReasonWrap" style="display:none">Contanos más
                            <input id="returnOtherReason" type="text" placeholder="Especificá el motivo">
                        </label>
                        <label>Descripción detallada
                            <textarea id="returnDescription" rows="5" placeholder="Describí el problema, el estado del producto y la resolución esperada."></textarea>
                        </label>
                        <label>Fotos / evidencia
                            <input id="returnEvidence" type="file" multiple accept="image/*">
                        </label>
                        <fieldset class="return-choice-group">
                            <legend>Preferencia</legend>
                            <label><input type="radio" name="requestType" value="refund" checked> Devolución</label>
                            <label><input type="radio" name="requestType" value="exchange"> Cambio</label>
                        </fieldset>
                        <div id="replacementWrap" style="display:none">
                            <label>Producto de reemplazo
                                <select id="replacementProduct">
                                    ${this.order.items.map(item => `<option value="${item.product_id}">${item.name} · ${item.talle}</option>`).join('')}
                                </select>
                            </label>
                        </div>
                        <div id="refundWrap" class="refund-summary">Monto estimado a reembolsar: <strong>${formatearMoneda(this.order.total)}</strong></div>
                        <label class="checkout-inline-check"><input id="returnTerms" type="checkbox"> Acepto los términos de devolución y autorizo la revisión del caso.</label>
                        <button class="orders-primary-btn" type="submit">Solicitar devolución</button>
                    </form>
                </div>
            </section>
        `;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ReturnRequestComponent());
} else {
    new ReturnRequestComponent();
}
