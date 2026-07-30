/**
 * COMPONENTE: PANEL DE VENDEDOR
 */
class SellerOrdersComponent {
    constructor() {
        this.root = document.getElementById('sellerOrdersApp');
        this.user = typeof authService !== 'undefined' ? authService.obtenerUsuario() : null;
        this.seller = this.user?.sellerProfile || orderManagementService.getSellerProfile();
        this.page = 1;
        this.pageSize = 6;
        this.init();
    }

    init() {
        if (!this.root) return;
        if (!this.user) {
            window.location.href = 'login.html';
            return;
        }
        this.renderShell();
        this.bind();
        this.render();
    }

    getFilters() {
        return {
            status: document.querySelector('input[name="sellerStatus"]:checked')?.value || 'all',
            dateFrom: document.getElementById('sellerDateFrom')?.value || '',
            dateTo: document.getElementById('sellerDateTo')?.value || '',
            orderId: document.getElementById('sellerSearchOrder')?.value.trim() || '',
            customerName: document.getElementById('sellerSearchCustomer')?.value.trim() || '',
            sortBy: document.getElementById('sellerSortBy')?.value || 'recent'
        };
    }

    get orders() {
        return orderManagementService.getSellerOrders(this.seller.id, this.getFilters());
    }

    renderShell() {
        this.root.innerHTML = `
            <section class="orders-page seller-view">
                <div class="orders-page-header">
                    <div>
                        <p class="orders-page-kicker">Mi Usuario · Vendedor</p>
                        <h1>Mis Ventas</h1>
                        <p>Administrá confirmaciones, tracking, mensajes y métricas de ventas en tiempo real.</p>
                    </div>
                    <div class="orders-page-actions">
                        <a class="orders-secondary-link" href="seller-dashboard.html">Ver dashboard</a>
                    </div>
                </div>
                <div id="sellerStatsCards" class="orders-stats-grid seller-stats"></div>
                <div class="orders-layout">
                    <aside class="orders-filters">
                        <div class="filter-card">
                            <h2>Estado del pedido</h2>
                            ${[
                                ['all', 'Todas'],
                                ['pending_confirmation', 'Pendiente confirmación'],
                                ['confirmed', 'Confirmado'],
                                ['preparing', 'Preparando'],
                                ['ready_to_ship', 'Listo para enviar'],
                                ['shipped', 'Enviado'],
                                ['delivered', 'Entregado'],
                                ['cancelled', 'Cancelado'],
                                ['returned', 'Devuelto']
                            ].map(([value, label], index) => `
                                <label class="filter-radio"><input type="radio" name="sellerStatus" value="${value}" ${index === 0 ? 'checked' : ''}><span>${label}</span></label>
                            `).join('')}
                        </div>
                        <div class="filter-card">
                            <h2>Filtros</h2>
                            <label>Desde<input id="sellerDateFrom" type="date"></label>
                            <label>Hasta<input id="sellerDateTo" type="date"></label>
                            <label>Orden<input id="sellerSearchOrder" type="search" placeholder="480-2026-001234"></label>
                            <label>Comprador<input id="sellerSearchCustomer" type="search" placeholder="Nombre del comprador"></label>
                            <label>Ordenar por
                                <select id="sellerSortBy">
                                    <option value="recent">Más reciente</option>
                                    <option value="price_desc">Mayor monto</option>
                                    <option value="price_asc">Menor monto</option>
                                </select>
                            </label>
                        </div>
                    </aside>
                    <div class="orders-content">
                        <div class="orders-table-wrap">
                            <div class="orders-table-scroll">
                                <table class="orders-table">
                                    <thead>
                                        <tr>
                                            <th>N° Orden</th>
                                            <th>Fecha</th>
                                            <th>Comprador</th>
                                            <th>Productos</th>
                                            <th>Monto</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="sellerOrdersBody"></tbody>
                                </table>
                            </div>
                            <div id="sellerOrdersPagination" class="orders-pagination"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    bind() {
        this.root.addEventListener('change', (event) => {
            if (event.target.matches('input, select')) {
                this.page = 1;
                this.render();
            }
        });
        this.root.addEventListener('input', debounce((event) => {
            if (event.target.matches('input[type="search"]')) {
                this.page = 1;
                this.render();
            }
        }, 200));
        this.root.addEventListener('click', (event) => {
            const actionBtn = event.target.closest('[data-action]');
            if (actionBtn) this.handleAction(actionBtn.dataset.action, actionBtn.dataset.orderId);
            if (event.target.matches('[data-page]')) {
                this.page = Number(event.target.dataset.page);
                this.render();
            }
        });
    }

    handleAction(action, orderId) {
        if (action === 'view' || action === 'messages') {
            window.location.href = `order-detail-seller.html?order_id=${encodeURIComponent(orderId)}${action === 'messages' ? '#chat' : ''}`;
            return;
        }
        if (action === 'ship') {
            const tracking = `OCA${Math.floor(Math.random() * 90000000 + 10000000)}`;
            orderManagementService.addTrackingNumber(orderId, tracking, 'OCA');
            NotificacionesComponent?.mostrar?.(`Pedido ${orderId} marcado como enviado.`, 'success');
        }
        if (action === 'cancel') {
            const reason = window.prompt('Indicá el motivo de cancelación:', 'Sin stock disponible');
            if (reason) {
                orderManagementService.cancelOrder(orderId, reason);
                NotificacionesComponent?.mostrar?.(`Pedido ${orderId} cancelado.`, 'warning');
            }
        }
        this.render();
    }

    renderStats() {
        const stats = sellerStatsService.getSellerStats(this.seller.id);
        document.getElementById('sellerStatsCards').innerHTML = [
            ['Órdenes hoy', stats.todayOrders],
            ['Órdenes esta semana', stats.weekOrders],
            ['Órdenes este mes', stats.monthOrders],
            ['Total ventas mes', formatearMoneda(stats.monthSales)],
            ['Rating promedio', `★ ${stats.averageRating}`]
        ].map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`).join('');
    }

    renderTable(orders) {
        const pageOrders = orders.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
        const body = document.getElementById('sellerOrdersBody');
        if (!pageOrders.length) {
            body.innerHTML = '<tr><td colspan="7"><div class="orders-empty-state">No hay ventas que coincidan con los filtros.</div></td></tr>';
            return;
        }
        body.innerHTML = pageOrders.map(order => `
            <tr>
                <td><a class="orders-link" href="order-detail-seller.html?order_id=${encodeURIComponent(order.order_id)}">${order.order_id}</a></td>
                <td>${new Date(order.order_date).toLocaleDateString('es-AR')}</td>
                <td>${order.buyer.name}</td>
                <td>${order.products_count} producto(s)</td>
                <td>${formatearMoneda(order.total)}</td>
                <td><span class="status-badge" style="--badge-color:${order.status_meta.color}">${order.status_label}</span></td>
                <td>
                    <div class="orders-action-stack">
                        <button class="orders-text-btn" type="button" data-action="view" data-order-id="${order.order_id}">Ver detalle</button>
                        <button class="orders-text-btn" type="button" data-action="messages" data-order-id="${order.order_id}">Mensajes ${order.unread_messages ? `<span class="inline-badge">${order.unread_messages}</span>` : ''}</button>
                        ${['ready_to_ship', 'confirmed', 'preparing'].includes(order.status) ? `<button class="orders-text-btn" type="button" data-action="ship" data-order-id="${order.order_id}">Marcar como enviado</button>` : ''}
                        ${!['cancelled', 'returned', 'delivered'].includes(order.status) ? `<button class="orders-text-btn danger" type="button" data-action="cancel" data-order-id="${order.order_id}">Cancelar</button>` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
        this.renderPagination(orders.length);
    }

    renderPagination(totalItems) {
        const totalPages = Math.max(1, Math.ceil(totalItems / this.pageSize));
        if (this.page > totalPages) this.page = totalPages;
        const container = document.getElementById('sellerOrdersPagination');
        container.innerHTML = totalPages <= 1 ? '' : Array.from({ length: totalPages }, (_, index) => `
            <button type="button" data-page="${index + 1}" class="${index + 1 === this.page ? 'active' : ''}">${index + 1}</button>
        `).join('');
    }

    render() {
        const orders = this.orders;
        this.renderStats();
        this.renderTable(orders);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SellerOrdersComponent());
} else {
    new SellerOrdersComponent();
}
