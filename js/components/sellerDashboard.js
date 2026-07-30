/**
 * COMPONENTE: DASHBOARD DE VENTAS
 */
class SellerDashboardComponent {
    constructor() {
        this.root = document.getElementById('sellerDashboardApp');
        this.user = typeof authService !== 'undefined' ? authService.obtenerUsuario() : null;
        this.seller = this.user?.sellerProfile || orderManagementService.getSellerProfile();
        this.init();
    }

    init() {
        if (!this.root) return;
        if (!this.user) {
            window.location.href = 'login.html';
            return;
        }
        this.render();
    }

    renderBarChart(data) {
        const max = Math.max(...data.map(item => item.total), 1);
        return data.map(item => `
            <div class="dashboard-bar-row">
                <span>${item.day}</span>
                <div class="dashboard-bar-track"><div class="dashboard-bar-fill" style="width:${Math.max(14, Math.round(item.total / max * 100))}%"></div></div>
                <strong>${formatearMoneda(item.total)}</strong>
            </div>
        `).join('');
    }

    render() {
        const stats = sellerStatsService.getSellerStats(this.seller.id);
        const monthly = sellerStatsService.getMonthlySales(this.seller.id);
        const products = sellerStatsService.getProductStats(this.seller.id);
        const ratings = sellerStatsService.getRatingStats(this.seller.id);
        const topOrders = orderManagementService.getSellerOrders(this.seller.id, { sortBy: 'price_desc' }).slice(0, 5);

        this.root.innerHTML = `
            <section class="seller-dashboard-page">
                <header class="seller-dashboard-header">
                    <div>
                        <p class="orders-page-kicker">Dashboard vendedor</p>
                        <h1>Resumen del mes</h1>
                        <p>Seguimiento de ventas, productos top y calidad de servicio.</p>
                    </div>
                    <div class="dashboard-quick-links">
                        <a href="user-orders-seller.html" class="orders-primary-btn">Ir a Mis Ventas</a>
                        <a href="user-profile.html" class="orders-outline-btn">Ver perfil</a>
                    </div>
                </header>
                <div class="dashboard-metrics-grid">
                    ${[
                        ['Total vendido (mes)', formatearMoneda(stats.monthSales)],
                        ['Promedio de venta', formatearMoneda(stats.averageTicket)],
                        ['Transacciones', stats.transactions],
                        ['Rating promedio', `★ ${stats.averageRating}`],
                        ['Entrega a tiempo', `${stats.onTimeRate}%`],
                        ['Tasa de devoluciones', `${stats.returnRate}%`],
                        ['Ingresos netos', formatearMoneda(stats.netIncome)]
                    ].map(([label, value]) => `<article class="dashboard-metric-card"><span>${label}</span><strong>${value}</strong></article>`).join('')}
                </div>
                <div class="dashboard-grid">
                    <article class="dashboard-card">
                        <h2>Ventas por día</h2>
                        <div class="dashboard-bar-chart">${this.renderBarChart(monthly)}</div>
                    </article>
                    <article class="dashboard-card">
                        <h2>Productos más vendidos</h2>
                        <div class="dashboard-product-pie">
                            ${products.map((item, index) => `<div class="dashboard-pie-row"><span class="dot dot-${index + 1}"></span><strong>${item.name}</strong><span>${item.quantity} u.</span><span>${formatearMoneda(item.sales)}</span></div>`).join('')}
                        </div>
                    </article>
                    <article class="dashboard-card full-width">
                        <h2>Top 5 órdenes</h2>
                        <table class="dashboard-table">
                            <thead><tr><th>Orden</th><th>Comprador</th><th>Estado</th><th>Total</th></tr></thead>
                            <tbody>
                                ${topOrders.map(order => `
                                    <tr>
                                        <td><a class="orders-link" href="order-detail-seller.html?order_id=${encodeURIComponent(order.order_id)}">${order.order_id}</a></td>
                                        <td>${order.buyer.name}</td>
                                        <td>${order.status_label}</td>
                                        <td>${formatearMoneda(order.total)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </article>
                    <article class="dashboard-card">
                        <h2>Rating y reviews</h2>
                        <p class="dashboard-rating-average">★ ${ratings.average}</p>
                        <div class="dashboard-review-list">
                            ${ratings.latest.map(item => `<div><strong>${item.orderId}</strong><span> · ${item.rating}/5</span><p>${item.review}</p></div>`).join('')}
                        </div>
                    </article>
                    <article class="dashboard-card">
                        <h2>Links rápidos</h2>
                        <div class="dashboard-links-list">
                            <a href="user-orders-seller.html">Ir a Mis Ventas</a>
                            <a href="../index.html#grid">Subir nuevo producto</a>
                            <a href="user-profile.html">Ver perfil</a>
                            <a href="order-confirmation.html">Historial de pagos</a>
                        </div>
                    </article>
                </div>
            </section>
        `;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SellerDashboardComponent());
} else {
    new SellerDashboardComponent();
}
