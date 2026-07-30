/**
 * COMPONENTE: PANEL DE COMPRADOR
 */
class BuyerOrdersComponent {
    constructor() {
        this.root = document.getElementById('buyerOrdersApp');
        this.user = typeof authService !== 'undefined' ? authService.obtenerUsuario() : null;
        this.page = 1;
        this.pageSize = 5;
        this.filters = { status: 'all', sortBy: 'recent' };
        this.init();
    }

    init() {
        if (!this.root) return;
        if (!this.user) {
            window.location.href = 'login.html';
            return;
        }
        this.renderShell();
        this.bindFilters();
        this.render();
    }

    get userId() {
        return `user_${this.user.id || 'demo'}`;
    }

    getFilters() {
        return {
            ...this.filters,
            status: document.querySelector('input[name="buyerStatus"]:checked')?.value || 'all',
            dateFrom: document.getElementById('buyerDateFrom')?.value || '',
            dateTo: document.getElementById('buyerDateTo')?.value || '',
            minPrice: document.getElementById('buyerMinPrice')?.value || '',
            maxPrice: document.getElementById('buyerMaxPrice')?.value || '',
            orderId: document.getElementById('buyerSearchOrder')?.value.trim() || '',
            sortBy: document.getElementById('buyerSortBy')?.value || 'recent'
        };
    }

    get orders() {
        return orderManagementService.getBuyerOrders(this.userId, this.getFilters());
    }

    paginate(orders) {
        const start = (this.page - 1) * this.pageSize;
        return orders.slice(start, start + this.pageSize);
    }

    renderShell() {
        this.root.innerHTML = `
            <section class="orders-page">
                <div class="orders-page-header">
                    <div>
                        <p class="orders-page-kicker">Mi Usuario</p>
                        <h1>Mis Compras</h1>
                        <p>Seguí cada pedido, iniciá devoluciones y repetí compras desde un solo lugar.</p>
                    </div>
                    <div class="orders-page-actions">
                        <a class="orders-secondary-link" href="user-profile.html">Volver a Mi Usuario</a>
                    </div>
                </div>
                <div class="orders-layout">
                    <aside class="orders-filters">
                        <div class="filter-card">
                            <h2>Estado del pedido</h2>
                            ${[
                                ['all', 'Todas las órdenes'],
                                ['paid_pending', 'Pagado / Pendiente pago'],
                                ['preparing', 'Preparando'],
                                ['shipped', 'En camino'],
                                ['delivered', 'Entregado'],
                                ['cancelled', 'Cancelado'],
                                ['returned', 'Devuelto']
                            ].map(([value, label], index) => `
                                <label class="filter-radio">
                                    <input type="radio" name="buyerStatus" value="${value}" ${index === 0 ? 'checked' : ''}>
                                    <span>${label}</span>
                                </label>
                            `).join('')}
                        </div>
                        <div class="filter-card">
                            <h2>Filtros rápidos</h2>
                            <label>Desde<input id="buyerDateFrom" type="date"></label>
                            <label>Hasta<input id="buyerDateTo" type="date"></label>
                            <label>Precio mínimo<input id="buyerMinPrice" type="number" min="0" placeholder="$ 0"></label>
                            <label>Precio máximo<input id="buyerMaxPrice" type="number" min="0" placeholder="$ 999999"></label>
                            <label>Número de orden<input id="buyerSearchOrder" type="search" placeholder="480-2026-001234"></label>
                            <label>Ordenar por
                                <select id="buyerSortBy">
                                    <option value="recent">Más reciente</option>
                                    <option value="price_desc">Precio mayor</option>
                                    <option value="price_asc">Precio menor</option>
                                    <option value="oldest">Más antigua</option>
                                </select>
                            </label>
                            <button id="buyerResetFilters" type="button" class="orders-outline-btn">Limpiar filtros</button>
                        </div>
                    </aside>
                    <div class="orders-content">
                        <div id="buyerOrderStats" class="orders-stats-grid"></div>
                        <div class="orders-table-wrap">
                            <div class="orders-table-toolbar">
                                <strong id="buyerOrderCount">0 órdenes</strong>
                            </div>
                            <div class="orders-table-scroll">
                                <table class="orders-table">
                                    <thead>
                                        <tr>
                                            <th>N° Orden</th>
                                            <th>Fecha</th>
                                            <th>Producto principal</th>
                                            <th>Productos</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="buyerOrdersBody"></tbody>
                                </table>
                            </div>
                            <div id="buyerOrdersPagination" class="orders-pagination"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    bindFilters() {
        this.root.addEventListener('change', (event) => {
            if (event.target.matches('input, select')) {
                this.page = 1;
                this.render();
            }
        });
        this.root.addEventListener('input', debounce((event) => {
            if (event.target.matches('input[type="search"], input[type="number"]')) {
                this.page = 1;
                this.render();
            }
        }, 200));
        this.root.addEventListener('click', (event) => {
            const button = event.target.closest('[data-action]');
            if (button) this.handleAction(button.dataset.action, button.dataset.orderId);
            if (event.target.id === 'buyerResetFilters') {
                this.root.querySelectorAll('input[type="date"], input[type="search"], input[type="number"]').forEach(input => { input.value = ''; });
                this.root.querySelector('input[name="buyerStatus"][value="all"]').checked = true;
                this.root.querySelector('#buyerSortBy').value = 'recent';
                this.page = 1;
                this.render();
            }
            if (event.target.matches('[data-page]')) {
                this.page = Number(event.target.dataset.page);
                this.render();
            }
        });
    }

    handleAction(action, orderId) {
        if (action === 'view') window.location.href = `order-detail-buyer.html?order_id=${encodeURIComponent(orderId)}`;
        if (action === 'track') {
            const order = orderManagementService.getOrderDetail(orderId);
            if (order?.shipment?.tracking_url) window.open(order.shipment.tracking_url, '_blank', 'noopener');
        }
        if (action === 'rate') window.location.href = `order-detail-buyer.html?order_id=${encodeURIComponent(orderId)}#rate`;
        if (action === 'issue') window.location.href = `return-request.html?order_id=${encodeURIComponent(orderId)}`;
        if (action === 'reorder') {
            const success = orderManagementService.reorder(orderId);
            if (success) {
                NotificacionesComponent?.mostrar?.('Productos agregados nuevamente al carrito.', 'success');
            }
        }
    }

    renderStats(orders) {
        const counters = orderManagementService.getStatusCounters(orders);
        const stats = [
            ['Órdenes totales', counters.total || 0, '#1a3a47'],
            ['Pendientes', (counters.pending_payment || 0) + (counters.paid || 0), '#FFC107'],
            ['En preparación', (counters.confirmed || 0) + (counters.preparing || 0), '#2196F3'],
            ['En camino', (counters.ready_to_ship || 0) + (counters.shipped || 0), '#00BCD4'],
            ['Entregadas', counters.delivered || 0, '#388E3C'],
            ['Devueltas', counters.returned || 0, '#9E9E9E']
        ];
        document.getElementById('buyerOrderStats').innerHTML = stats.map(([label, value, color]) => `
            <article class="stat-card">
                <span>${label}</span>
                <strong style="color:${color}">${value}</strong>
            </article>
        `).join('');
    }

    renderTable(orders) {
        const currentOrders = this.paginate(orders);
        const body = document.getElementById('buyerOrdersBody');
        document.getElementById('buyerOrderCount').textContent = `${orders.length} órdenes`;

        if (!currentOrders.length) {
            body.innerHTML = `<tr><td colspan="7"><div class="orders-empty-state">No encontramos órdenes con esos filtros.</div></td></tr>`;
            document.getElementById('buyerOrdersPagination').innerHTML = '';
            return;
        }

        body.innerHTML = currentOrders.map(order => `
            <tr>
                <td><a class="orders-link" href="order-detail-buyer.html?order_id=${encodeURIComponent(order.order_id)}">${order.order_id}</a></td>
                <td>${new Date(order.order_date).toLocaleDateString('es-AR')}</td>
                <td>
                    <div class="order-product-cell">
                        <img src="${order.items[0]?.imagen}" alt="${order.items[0]?.name}">
                        <span>${order.items[0]?.name || 'Producto Cota 480'}</span>
                    </div>
                </td>
                <td>${order.products_count} producto(s)</td>
                <td>${formatearMoneda(order.total)}</td>
                <td><span class="status-badge" style="--badge-color:${order.status_meta.color}">${order.status_label}</span></td>
                <td>
                    <div class="orders-action-stack">
                        <button class="orders-text-btn" type="button" data-action="view" data-order-id="${order.order_id}">Ver detalle</button>
                        ${['ready_to_ship', 'shipped', 'delivered', 'returned'].includes(order.status) ? `<button class="orders-text-btn" type="button" data-action="track" data-order-id="${order.order_id}">Rastrear</button>` : ''}
                        ${order.status === 'delivered' ? `<button class="orders-text-btn" type="button" data-action="rate" data-order-id="${order.order_id}">Calificar</button>` : ''}
                        <button class="orders-text-btn" type="button" data-action="issue" data-order-id="${order.order_id}">Reportar problema</button>
                        <button class="orders-text-btn" type="button" data-action="reorder" data-order-id="${order.order_id}">Reordenar</button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.renderPagination(orders.length, 'buyerOrdersPagination');
    }

    renderPagination(totalItems, containerId) {
        const totalPages = Math.max(1, Math.ceil(totalItems / this.pageSize));
        if (this.page > totalPages) this.page = totalPages;
        const container = document.getElementById(containerId);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = Array.from({ length: totalPages }, (_, index) => index + 1).map(page => `
            <button type="button" data-page="${page}" class="${page === this.page ? 'active' : ''}">${page}</button>
        `).join('');
    }

    render() {
        const orders = this.orders;
        this.renderStats(orders);
        this.renderTable(orders);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BuyerOrdersComponent());
} else {
    new BuyerOrdersComponent();
}
