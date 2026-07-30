/**
 * SERVICIO DE ESTADÍSTICAS DE VENDEDOR
 */
class SellerStatsService {
    getSellerStats(sellerId) {
        const orders = orderManagementService.getSellerOrders(sellerId, { sortBy: 'recent' });
        const now = new Date();
        const sameDay = (date) => {
            const value = new Date(date);
            return value.toDateString() === now.toDateString();
        };
        const sameWeek = (date) => {
            const value = new Date(date);
            const diff = now - value;
            return diff >= 0 && diff <= 1000 * 60 * 60 * 24 * 7;
        };
        const sameMonth = (date) => {
            const value = new Date(date);
            return value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear();
        };

        const delivered = orders.filter(order => order.status === 'delivered');
        const returned = orders.filter(order => order.status === 'returned');
        const onTime = orders.filter(order => ['shipped', 'delivered', 'returned'].includes(order.status));
        const avgRating = delivered.reduce((acc, order) => acc + Number(order.rating || 4.8), 0) / (delivered.length || 1);

        return {
            totalOrders: orders.length,
            todayOrders: orders.filter(order => sameDay(order.order_date)).length,
            weekOrders: orders.filter(order => sameWeek(order.order_date)).length,
            monthOrders: orders.filter(order => sameMonth(order.order_date)).length,
            monthSales: orders.filter(order => sameMonth(order.order_date)).reduce((acc, order) => acc + order.total, 0),
            averageRating: Number(avgRating.toFixed(1)),
            transactions: orders.length,
            averageTicket: orders.length ? Math.round(orders.reduce((acc, order) => acc + order.total, 0) / orders.length) : 0,
            onTimeRate: onTime.length ? Math.round((delivered.length / onTime.length) * 100) : 100,
            returnRate: orders.length ? Math.round((returned.length / orders.length) * 100) : 0,
            netIncome: Math.round(orders.reduce((acc, order) => acc + order.total * 0.88, 0))
        };
    }

    getMonthlySales(sellerId) {
        const orders = orderManagementService.getSellerOrders(sellerId, { sortBy: 'oldest' });
        const byDay = new Map();
        orders.forEach(order => {
            const day = new Date(order.order_date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
            byDay.set(day, (byDay.get(day) || 0) + order.total);
        });
        return Array.from(byDay.entries()).map(([day, total]) => ({ day, total }));
    }

    getProductStats(sellerId) {
        const orders = orderManagementService.getSellerOrders(sellerId, { sortBy: 'recent' });
        const products = new Map();
        orders.forEach(order => {
            order.items.forEach(item => {
                const current = products.get(item.name) || { name: item.name, quantity: 0, sales: 0 };
                current.quantity += item.quantity;
                current.sales += item.subtotal;
                products.set(item.name, current);
            });
        });
        return Array.from(products.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    }

    getRatingStats(sellerId) {
        const orders = orderManagementService.getSellerOrders(sellerId, { sortBy: 'recent' });
        const rated = orders.filter(order => Number(order.rating));
        return {
            average: rated.length ? Number((rated.reduce((acc, order) => acc + Number(order.rating || 0), 0) / rated.length).toFixed(1)) : 4.9,
            totalReviews: rated.length,
            latest: rated.slice(0, 3).map(order => ({
                orderId: order.order_id,
                rating: order.rating,
                review: order.review || 'Excelente experiencia.'
            }))
        };
    }
}

const sellerStatsService = new SellerStatsService();
