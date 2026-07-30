/**
 * SERVICIO DE GESTIÓN DE PEDIDOS
 * Extiende el flujo de checkout con vistas comprador/vendedor, tracking y devoluciones.
 */
class OrderManagementService {
    constructor() {
        this.ordersKey = '480_orders';
        this.messagesKey = '480_order_messages';
        this.notificationsKey = '480_order_notifications';
        this.returnsKey = '480_order_returns';
        this.defaultSeller = {
            id: 'seller_480',
            name: 'Cota 480 Oficial',
            logo: '🏔️',
            rating: 4.9,
            response: '< 1 hora',
            policy: 'Devoluciones y cambios hasta 30 días en productos sin uso.'
        };
        this.statusMap = {
            pending_payment: { label: 'Pendiente pago', color: '#FFC107', group: 'pending' },
            paid: { label: 'Pagado', color: '#4CAF50', group: 'paid' },
            confirmed: { label: 'Confirmado', color: '#4CAF50', group: 'preparing' },
            preparing: { label: 'Preparando', color: '#2196F3', group: 'preparing' },
            ready_to_ship: { label: 'Listo para enviar', color: '#03A9F4', group: 'shipped' },
            shipped: { label: 'Enviado', color: '#00BCD4', group: 'shipped' },
            delivered: { label: 'Entregado', color: '#388E3C', group: 'delivered' },
            cancelled: { label: 'Cancelado', color: '#f44336', group: 'cancelled' },
            returned: { label: 'Devuelto', color: '#9E9E9E', group: 'returned' }
        };
        this.timelineOrder = ['paid', 'confirmed', 'preparing', 'ready_to_ship', 'shipped', 'delivered'];
    }

    getCurrentUser() {
        return typeof authService !== 'undefined' ? authService.obtenerUsuario() : null;
    }

    getSellerProfile() {
        const user = this.getCurrentUser();
        return user?.sellerProfile?.active ? user.sellerProfile : this.defaultSeller;
    }

    readJson(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (_error) {
            return fallback;
        }
    }

    writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getStatusMeta(status) {
        return this.statusMap[status] || this.statusMap.pending_payment;
    }

    resolveStatus(order) {
        if (this.statusMap[order.status]) return order.status;

        switch (order.status) {
            case 'pending':
                return 'pending_payment';
            case 'processing':
                return order.payment?.status === 'approved' ? 'confirmed' : 'paid';
            case 'completed':
                return 'paid';
            case 'shipped':
                return 'shipped';
            case 'rejected':
                return 'cancelled';
            default:
                return 'pending_payment';
        }
    }

    getBaseOrders() {
        if (typeof ordersService !== 'undefined' && typeof ordersService.getOrders === 'function') {
            return ordersService.getOrders();
        }
        return this.readJson(this.ordersKey, []);
    }

    saveOrders(orders) {
        if (typeof ordersService !== 'undefined' && typeof ordersService.saveOrders === 'function') {
            ordersService.saveOrders(orders);
            return;
        }
        this.writeJson(this.ordersKey, orders);
    }

    ensureDemoData() {
        const user = this.getCurrentUser();
        if (!user) return;

        const seedKey = `480_order_demo_seed_${user.id || user.email}`;
        if (localStorage.getItem(seedKey)) return;

        const existingOrders = this.getBaseOrders();
        const seller = this.getSellerProfile();
        const baseDate = Date.now();
        const buyerId = `user_${user.id || 'demo'}`;
        const products = (typeof productosService !== 'undefined' ? productosService.obtenerTodos() : PRODUCTOS_DESTACADOS).slice(0, 4);
        const demoOrders = [
            this.buildDemoOrder({
                id: `480-${new Date().getFullYear()}-001234`,
                buyer: user,
                buyerId,
                seller,
                date: new Date(baseDate - 1000 * 60 * 60 * 24 * 8).toISOString(),
                status: 'delivered',
                items: [products[0], products[1]],
                shipping: { city: 'San Martín de los Andes', province: 'Neuquén', address: 'Av. del Cerro 480', postal_code: '8370' },
                paymentStatus: 'approved',
                tracking: 'OCA123456789',
                messages: [
                    { from: 'buyer', content: '¿Puedo cambiar el talle de las antiparras?' },
                    { from: 'seller', content: 'Sí, podés iniciar la solicitud desde tu pedido y te ayudamos.' }
                ],
                rating: 5,
                review: 'La tabla llegó impecable y el vendedor respondió rapidísimo.'
            }),
            this.buildDemoOrder({
                id: `480-${new Date().getFullYear()}-001235`,
                buyer: user,
                buyerId,
                seller,
                date: new Date(baseDate - 1000 * 60 * 60 * 24 * 3).toISOString(),
                status: 'shipped',
                items: [products[2]],
                shipping: { city: 'Bariloche', province: 'Río Negro', address: 'Ruta 40 Km 1985', postal_code: '8400' },
                paymentStatus: 'approved',
                tracking: 'OCA987654321'
            }),
            this.buildDemoOrder({
                id: `480-${new Date().getFullYear()}-001236`,
                buyer: user,
                buyerId,
                seller,
                date: new Date(baseDate - 1000 * 60 * 60 * 18).toISOString(),
                status: 'preparing',
                items: [products[1], products[3] || products[0]],
                shipping: { city: 'Ushuaia', province: 'Tierra del Fuego', address: 'Paseo de la Nieve 22', postal_code: '9410' },
                paymentStatus: 'approved'
            }),
            this.buildDemoOrder({
                id: `480-${new Date().getFullYear()}-001237`,
                buyer: user,
                buyerId,
                seller,
                date: new Date(baseDate - 1000 * 60 * 30).toISOString(),
                status: 'pending_payment',
                items: [products[0]],
                shipping: { city: 'Mendoza', province: 'Mendoza', address: 'Las Leñas 150', postal_code: '5500' },
                paymentStatus: 'pending'
            }),
            this.buildDemoOrder({
                id: `480-${new Date().getFullYear()}-001238`,
                buyer: user,
                buyerId,
                seller,
                date: new Date(baseDate - 1000 * 60 * 60 * 24 * 14).toISOString(),
                status: 'returned',
                items: [products[1]],
                shipping: { city: 'Villa La Angostura', province: 'Neuquén', address: 'Bosque 101', postal_code: '8407' },
                paymentStatus: 'refunded'
            })
        ];

        const orderIds = new Set(existingOrders.map(order => order.order_id));
        const mergedOrders = [...demoOrders.filter(order => !orderIds.has(order.order_id)), ...existingOrders];
        this.saveOrders(mergedOrders);

        const messages = this.readJson(this.messagesKey, []);
        demoOrders.forEach(order => {
            (order.demo_messages || []).forEach(message => {
                if (!messages.some(item => item.message_id === message.message_id)) {
                    messages.push(message);
                }
            });
        });
        this.writeJson(this.messagesKey, messages);

        this.addNotification({
            userId: buyerId,
            type: 'order',
            title: 'Panel de pedidos listo',
            message: 'Ya podés revisar tus compras, ventas, tracking y devoluciones desde Mi Usuario.'
        });
        this.addNotification({
            userId: seller.id,
            type: 'sale',
            title: 'Ventas sincronizadas',
            message: 'Tus ventas demo fueron cargadas para probar el dashboard del vendedor.'
        });

        localStorage.setItem(seedKey, '1');
    }

    buildDemoOrder({ id, buyer, buyerId, seller, date, status, items, shipping, paymentStatus, tracking = null, messages = [], rating = null, review = '' }) {
        const normalizedItems = items.map((product, index) => ({
            product_id: product.id,
            id: product.id,
            name: product.nombre,
            nombre: product.nombre,
            quantity: index === 0 ? 1 : 2,
            cantidad: index === 0 ? 1 : 2,
            unit_price: product.precio,
            precio: product.precio,
            subtotal: product.precio * (index === 0 ? 1 : 2),
            size: product.talles?.[Math.min(index, product.talles.length - 1)] || 'Único',
            talle: product.talles?.[Math.min(index, product.talles.length - 1)] || 'Único',
            color: product.colores?.[0]?.nombre || 'Default',
            imagen: product.imagen
        }));
        const subtotal = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);
        const discount = status === 'returned' ? 0 : Math.round(subtotal * 0.05);
        const tax = Math.round((subtotal - discount) * 0.21);
        const shippingCost = subtotal > 10000 ? 0 : 1500;
        const total = subtotal - discount + tax + shippingCost;
        const sellerId = seller.id || this.defaultSeller.id;
        const buyerName = `${buyer.nombre || ''} ${buyer.apellido || ''}`.trim() || 'Cliente Cota 480';
        const history = this.buildStatusHistory(status, date, sellerId);
        const trackingEvents = this.buildTrackingEvents(status, date, tracking);

        return {
            order_id: id,
            user_id: buyerId,
            user_email: buyer.email,
            order_date: date,
            status,
            items: normalizedItems,
            subtotal,
            tax,
            shipping_cost: shippingCost,
            discount,
            discount_code: discount ? 'WINTER5' : '',
            total,
            seller_id: sellerId,
            seller: {
                id: sellerId,
                name: seller.name || this.defaultSeller.name,
                logo: seller.logo || this.defaultSeller.logo,
                rating: seller.rating || this.defaultSeller.rating,
                policy: seller.policy || this.defaultSeller.policy,
                response: seller.response || this.defaultSeller.response
            },
            buyer: {
                id: buyerId,
                name: buyerName,
                email: buyer.email,
                phone: buyer.telefono || '+54 9 11 5555-4800'
            },
            shipping_address: {
                name: buyerName,
                email: buyer.email,
                phone: buyer.telefono || '+54 9 11 5555-4800',
                address: shipping.address,
                city: shipping.city,
                province: shipping.province,
                postal_code: shipping.postal_code,
                apartment: '',
                instructions: 'Entregar en portería si no respondo.'
            },
            payment: {
                method: 'mercadopago',
                mercadopago_id: `MP-${id.split('-').pop()}`,
                card_last_four: '4242',
                installments: 3,
                status: paymentStatus,
                paid_at: paymentStatus === 'approved' ? date : null
            },
            shipment: {
                method: 'express',
                carrier: 'OCA',
                tracking_number: tracking,
                estimated_delivery: '2-3 días',
                shipped_at: ['shipped', 'delivered', 'returned'].includes(status) ? new Date(new Date(date).getTime() + 1000 * 60 * 60 * 18).toISOString() : null,
                delivered_at: ['delivered', 'returned'].includes(status) ? new Date(new Date(date).getTime() + 1000 * 60 * 60 * 72).toISOString() : null,
                tracking_url: tracking ? `https://www.oca.com.ar/seguimiento?pieza=${encodeURIComponent(tracking)}` : '',
                events: trackingEvents
            },
            status_history: history,
            next_steps: ['Seguimiento disponible desde Mi Usuario.', 'Podés contactar al vendedor o gestionar una devolución.'],
            rating,
            review,
            return_request: status === 'returned' ? {
                return_id: `ret_${id}`,
                order_id: id,
                requested_by: buyerId,
                requested_at: new Date(new Date(date).getTime() + 1000 * 60 * 60 * 96).toISOString(),
                reason: 'Talle incorrecto',
                description: 'El producto llegó más ajustado de lo esperado.',
                images: ['return-photo-1.jpg'],
                status: 'aprobada',
                refund_amount: total,
                approved_at: new Date(new Date(date).getTime() + 1000 * 60 * 60 * 120).toISOString(),
                refund_processed_at: new Date(new Date(date).getTime() + 1000 * 60 * 60 * 144).toISOString()
            } : null,
            demo_messages: messages.map((message, index) => ({
                message_id: `${id}-msg-${index + 1}`,
                order_id: id,
                from_user_id: message.from === 'buyer' ? buyerId : sellerId,
                from_type: message.from,
                to_user_id: message.from === 'buyer' ? sellerId : buyerId,
                content: message.content,
                timestamp: new Date(new Date(date).getTime() + 1000 * 60 * 60 * (index + 4)).toISOString(),
                read: true,
                read_at: new Date(new Date(date).getTime() + 1000 * 60 * 60 * (index + 5)).toISOString()
            }))
        };
    }

    buildStatusHistory(status, orderDate, sellerId) {
        const date = new Date(orderDate).getTime();
        const steps = ['paid', 'confirmed', 'preparing', 'ready_to_ship', 'shipped', 'delivered'];
        const currentIndex = Math.max(steps.indexOf(status), status === 'returned' ? steps.indexOf('delivered') : 0);
        const base = [{
            status: status === 'pending_payment' ? 'pending_payment' : 'paid',
            timestamp: new Date(date + 1000 * 60 * 10).toISOString(),
            by: status === 'pending_payment' ? 'system' : 'system',
            message: status === 'pending_payment' ? 'Esperando confirmación de pago' : 'Pago confirmado'
        }];

        if (status === 'pending_payment') {
            return base;
        }

        steps.slice(1, currentIndex + 1).forEach((step, index) => {
            const messages = {
                confirmed: 'Pedido confirmado por vendedor',
                preparing: 'Preparando envío',
                ready_to_ship: 'Pedido listo para despachar',
                shipped: 'Pedido entregado al transportista',
                delivered: 'Pedido entregado al cliente'
            };
            base.push({
                status: step,
                timestamp: new Date(date + 1000 * 60 * 60 * (index + 2)).toISOString(),
                by: sellerId,
                message: messages[step]
            });
        });

        if (status === 'cancelled') {
            base.push({
                status: 'cancelled',
                timestamp: new Date(date + 1000 * 60 * 60 * 4).toISOString(),
                by: sellerId,
                message: 'Pedido cancelado por el vendedor'
            });
        }

        if (status === 'returned') {
            base.push({
                status: 'returned',
                timestamp: new Date(date + 1000 * 60 * 60 * 96).toISOString(),
                by: 'buyer',
                message: 'Devolución solicitada y aprobada'
            });
        }

        return base;
    }

    buildTrackingEvents(status, orderDate, tracking) {
        if (!tracking || !['shipped', 'delivered', 'returned'].includes(status)) return [];
        const date = new Date(orderDate).getTime();
        const events = [
            {
                status: 'en_transito',
                location: 'Centro de distribución CABA',
                timestamp: new Date(date + 1000 * 60 * 60 * 24).toISOString()
            }
        ];

        if (['delivered', 'returned'].includes(status)) {
            events.push({
                status: 'entregado',
                location: 'Domicilio del cliente',
                timestamp: new Date(date + 1000 * 60 * 60 * 72).toISOString()
            });
        }

        return events;
    }

    ensureOrderShape(order) {
        const normalizedStatus = this.resolveStatus(order);
        const statusMeta = this.getStatusMeta(normalizedStatus);
        const seller = order.seller || {};
        const buyer = order.buyer || {};
        const items = (order.items || []).map(item => {
            const product = typeof productosService !== 'undefined'
                ? productosService.obtenerPorId(item.product_id || item.id)
                : null;
            const quantity = Number(item.quantity || item.cantidad || 1);
            const unitPrice = Number(item.unit_price || item.precio || 0);
            return {
                ...item,
                id: item.id || item.product_id,
                product_id: item.product_id || item.id,
                name: item.name || item.nombre || product?.nombre || 'Producto Cota 480',
                nombre: item.nombre || item.name || product?.nombre || 'Producto Cota 480',
                quantity,
                cantidad: quantity,
                unit_price: unitPrice,
                precio: unitPrice,
                subtotal: Number(item.subtotal || unitPrice * quantity),
                imagen: item.imagen || product?.imagen || 'https://via.placeholder.com/88x88?text=480',
                talle: item.talle || item.size || product?.talles?.[0] || 'Único',
                size: item.size || item.talle || product?.talles?.[0] || 'Único',
                link: `product-detail.html?id=${encodeURIComponent(item.product_id || item.id || product?.id || '')}`
            };
        });

        const orderDate = order.order_date || new Date().toISOString();
        const sellerId = order.seller_id || seller.id || this.defaultSeller.id;
        const computedTotal = items.reduce((acc, item) => acc + item.subtotal, 0);
        const fallbackHistory = this.buildStatusHistory(normalizedStatus, orderDate, sellerId);
        const shipment = {
            method: order.shipment?.method || 'standard',
            carrier: order.shipment?.carrier || 'OCA',
            tracking_number: order.shipment?.tracking_number || null,
            estimated_delivery: order.shipment?.estimated_delivery || '5-7 días',
            shipped_at: order.shipment?.shipped_at || null,
            delivered_at: order.shipment?.delivered_at || null,
            tracking_url: order.shipment?.tracking_url || (order.shipment?.tracking_number
                ? `https://www.oca.com.ar/seguimiento?pieza=${encodeURIComponent(order.shipment.tracking_number)}`
                : ''),
            events: Array.isArray(order.shipment?.events) ? order.shipment.events : this.buildTrackingEvents(normalizedStatus, orderDate, order.shipment?.tracking_number)
        };

        return {
            ...order,
            status: normalizedStatus,
            status_meta: statusMeta,
            status_label: statusMeta.label,
            items,
            order_date: orderDate,
            seller_id: sellerId,
            seller: {
                id: sellerId,
                name: seller.name || this.defaultSeller.name,
                logo: seller.logo || this.defaultSeller.logo,
                rating: seller.rating || this.defaultSeller.rating,
                policy: seller.policy || this.defaultSeller.policy,
                response: seller.response || this.defaultSeller.response
            },
            buyer: {
                id: order.user_id || buyer.id || 'guest',
                name: buyer.name || order.shipping_address?.name || 'Cliente Cota 480',
                email: buyer.email || order.user_email || order.shipping_address?.email || '',
                phone: buyer.phone || order.shipping_address?.phone || ''
            },
            subtotal: Number(order.subtotal || computedTotal),
            tax: Number(order.tax || Math.round(computedTotal * 0.21)),
            shipping_cost: Number(order.shipping_cost || 0),
            discount: Number(order.discount || 0),
            total: Number(order.total || computedTotal + Number(order.tax || 0) + Number(order.shipping_cost || 0) - Number(order.discount || 0)),
            payment: {
                method: order.payment?.method || 'mercadopago',
                mercadopago_id: order.payment?.mercadopago_id || null,
                card_last_four: order.payment?.card_last_four || null,
                installments: Number(order.payment?.installments || 1),
                status: order.payment?.status || (normalizedStatus === 'pending_payment' ? 'pending' : 'approved'),
                paid_at: order.payment?.paid_at || null
            },
            shipment,
            status_history: Array.isArray(order.status_history) && order.status_history.length ? order.status_history : fallbackHistory,
            return_request: order.return_request || null,
            unread_messages: this.getUnreadMessageCount(order.order_id),
            products_count: items.reduce((acc, item) => acc + item.quantity, 0)
        };
    }

    getOrders() {
        this.ensureDemoData();
        return this.getBaseOrders().map(order => this.ensureOrderShape(order));
    }

    getOrderDetail(orderId) {
        return this.getOrders().find(order => order.order_id === orderId) || null;
    }

    filterByDateRange(orders, dateFrom, dateTo) {
        return orders.filter(order => {
            const value = new Date(order.order_date).getTime();
            if (dateFrom && value < new Date(dateFrom).getTime()) return false;
            if (dateTo && value > new Date(dateTo).getTime() + 1000 * 60 * 60 * 24 - 1) return false;
            return true;
        });
    }

    sortOrders(orders, sortBy = 'recent') {
        const list = [...orders];
        switch (sortBy) {
            case 'price_desc':
                return list.sort((a, b) => b.total - a.total);
            case 'price_asc':
                return list.sort((a, b) => a.total - b.total);
            case 'oldest':
                return list.sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
            default:
                return list.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        }
    }

    getBuyerOrders(userId, filters = {}) {
        let orders = this.getOrders().filter(order => order.user_id === userId || order.user_email === userId);
        orders = this.applyOrderFilters(orders, filters, 'buyer');
        return orders;
    }

    getSellerOrders(sellerId, filters = {}) {
        let orders = this.getOrders().filter(order => order.seller_id === sellerId);
        orders = this.applyOrderFilters(orders, filters, 'seller');
        return orders;
    }

    applyOrderFilters(orders, filters = {}, mode = 'buyer') {
        let result = [...orders];
        const status = filters.status || 'all';
        if (status !== 'all') {
            const groups = {
                paid_pending: ['pending_payment', 'paid'],
                pending_confirmation: ['paid'],
                preparing: ['confirmed', 'preparing'],
                shipped: ['ready_to_ship', 'shipped'],
                delivered: ['delivered'],
                cancelled: ['cancelled'],
                returned: ['returned']
            };
            result = result.filter(order => groups[status] ? groups[status].includes(order.status) : order.status === status);
        }

        if (filters.orderId) {
            const value = filters.orderId.toLowerCase();
            result = result.filter(order => order.order_id.toLowerCase().includes(value));
        }

        if (filters.customerName && mode === 'seller') {
            const value = filters.customerName.toLowerCase();
            result = result.filter(order => order.buyer.name.toLowerCase().includes(value));
        }

        if (filters.minPrice) {
            result = result.filter(order => order.total >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            result = result.filter(order => order.total <= Number(filters.maxPrice));
        }

        result = this.filterByDateRange(result, filters.dateFrom, filters.dateTo);
        return this.sortOrders(result, filters.sortBy || 'recent');
    }

    getStatusCounters(orders) {
        return orders.reduce((acc, order) => {
            acc.total += 1;
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, { total: 0 });
    }

    appendHistory(order, status, message, by) {
        order.status_history = Array.isArray(order.status_history) ? order.status_history : [];
        order.status_history.push({
            status,
            timestamp: new Date().toISOString(),
            by,
            message
        });
    }

    addNotification(notification) {
        const notifications = this.readJson(this.notificationsKey, []);
        notifications.unshift({
            id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            created_at: new Date().toISOString(),
            read: false,
            ...notification
        });
        this.writeJson(this.notificationsKey, notifications.slice(0, 80));
    }

    getNotifications(userId) {
        return this.readJson(this.notificationsKey, []).filter(item => item.userId === userId || item.userId === 'all');
    }

    markNotificationAsRead(notificationId) {
        const notifications = this.readJson(this.notificationsKey, []);
        const item = notifications.find(notification => notification.id === notificationId);
        if (item) item.read = true;
        this.writeJson(this.notificationsKey, notifications);
    }

    markAllNotificationsAsRead(userId) {
        const notifications = this.readJson(this.notificationsKey, []);
        notifications.forEach(item => {
            if (item.userId === userId) item.read = true;
        });
        this.writeJson(this.notificationsKey, notifications);
    }

    getUnreadNotificationCount(userId) {
        return this.getNotifications(userId).filter(item => !item.read).length;
    }

    updateStoredOrder(orderId, updater) {
        const orders = this.getBaseOrders();
        const index = orders.findIndex(order => order.order_id === orderId);
        if (index < 0) throw new Error('Orden no encontrada');
        const cloned = JSON.parse(JSON.stringify(orders[index]));
        const updated = updater(this.ensureOrderShape(cloned));
        orders[index] = updated;
        this.saveOrders(orders);
        return this.ensureOrderShape(updated);
    }

    updateOrderStatus(orderId, newStatus) {
        const order = this.updateStoredOrder(orderId, current => {
            current.status = newStatus;
            if (newStatus === 'shipped' && !current.shipment.tracking_number) {
                current.shipment.tracking_number = `OCA${Math.floor(Math.random() * 900000000)}`;
                current.shipment.tracking_url = `https://www.oca.com.ar/seguimiento?pieza=${encodeURIComponent(current.shipment.tracking_number)}`;
            }
            if (newStatus === 'shipped') {
                current.shipment.shipped_at = current.shipment.shipped_at || new Date().toISOString();
                if (!current.shipment.events.some(event => event.status === 'en_transito')) {
                    current.shipment.events.push({
                        status: 'en_transito',
                        location: 'Centro de distribución CABA',
                        timestamp: new Date().toISOString()
                    });
                }
            }
            if (newStatus === 'delivered') {
                current.shipment.delivered_at = new Date().toISOString();
                if (!current.shipment.events.some(event => event.status === 'entregado')) {
                    current.shipment.events.push({
                        status: 'entregado',
                        location: 'Domicilio del cliente',
                        timestamp: new Date().toISOString()
                    });
                }
            }
            const messages = {
                pending_payment: 'Esperando confirmación de pago',
                paid: 'Pago confirmado',
                confirmed: 'Pedido confirmado',
                preparing: 'Pedido en preparación',
                ready_to_ship: 'Pedido listo para enviar',
                shipped: 'Pedido despachado',
                delivered: 'Pedido entregado',
                cancelled: 'Pedido cancelado',
                returned: 'Pedido devuelto'
            };
            this.appendHistory(current, newStatus, messages[newStatus] || `Estado actualizado a ${newStatus}`, this.getSellerProfile().id);
            return current;
        });

        this.addNotification({
            userId: order.user_id,
            type: 'status',
            title: `Tu pedido ${order.order_id} cambió de estado`,
            message: `Ahora está en estado: ${order.status_label}.`
        });
        return order;
    }

    confirmOrder(orderId) {
        return this.updateOrderStatus(orderId, 'confirmed');
    }

    cancelOrder(orderId, reason = 'Sin motivo informado') {
        const order = this.updateStoredOrder(orderId, current => {
            current.status = 'cancelled';
            this.appendHistory(current, 'cancelled', `Pedido cancelado: ${reason}`, this.getSellerProfile().id);
            current.cancellation_reason = reason;
            return current;
        });
        this.addNotification({
            userId: order.user_id,
            type: 'status',
            title: `Pedido ${order.order_id} cancelado`,
            message: reason
        });
        return order;
    }

    addTrackingNumber(orderId, number, carrier = 'OCA') {
        return this.updateStoredOrder(orderId, current => {
            current.status = 'shipped';
            current.shipment = {
                ...current.shipment,
                carrier,
                tracking_number: number,
                tracking_url: `https://www.oca.com.ar/seguimiento?pieza=${encodeURIComponent(number)}`,
                shipped_at: new Date().toISOString(),
                events: [
                    ...(current.shipment?.events || []),
                    {
                        status: 'en_transito',
                        location: 'Centro logístico',
                        timestamp: new Date().toISOString()
                    }
                ]
            };
            this.appendHistory(current, 'shipped', `Envío confirmado vía ${carrier}`, this.getSellerProfile().id);
            return current;
        });
    }

    requestReturn(orderId, data) {
        const returns = this.readJson(this.returnsKey, []);
        const order = this.updateStoredOrder(orderId, current => {
            const payload = {
                return_id: `ret_${Date.now()}`,
                order_id: orderId,
                requested_by: current.user_id,
                requested_at: new Date().toISOString(),
                reason: data.reason,
                description: data.description,
                images: data.images || [],
                status: 'pendiente',
                refund_amount: Number(data.refund_amount || current.total),
                approved_at: null,
                refund_processed_at: null,
                exchange_type: data.requestType,
                replacement_product_id: data.replacementProductId || null,
                extra_reason: data.extraReason || ''
            };
            current.return_request = payload;
            current.status = 'returned';
            this.appendHistory(current, 'returned', 'Solicitud de devolución/cambio registrada', current.user_id);
            returns.unshift(payload);
            return current;
        });
        this.writeJson(this.returnsKey, returns.slice(0, 30));
        this.addNotification({
            userId: order.seller_id,
            type: 'return',
            title: `Nueva devolución en ${order.order_id}`,
            message: `${order.buyer.name} solicitó una devolución/cambio.`
        });
        return order.return_request;
    }

    reorder(orderId) {
        const order = this.getOrderDetail(orderId);
        if (!order || typeof carritoService === 'undefined') return false;
        order.items.forEach(item => {
            const product = typeof productosService !== 'undefined'
                ? productosService.obtenerPorId(item.product_id)
                : null;
            if (product) {
                carritoService.agregarProducto({
                    ...product,
                    talle: item.talle,
                    color: item.color,
                    imagen: item.imagen
                }, item.quantity);
            }
        });
        return true;
    }

    getMessages(orderId) {
        return this.readJson(this.messagesKey, []).filter(message => message.order_id === orderId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    getUnreadMessageCount(orderId) {
        return this.getMessages(orderId).filter(message => !message.read).length;
    }

    sendMessage(orderId, message, fromType = 'buyer') {
        const order = this.getOrderDetail(orderId);
        if (!order) throw new Error('Orden no encontrada');
        const sellerId = order.seller_id;
        const buyerId = order.user_id;
        const payload = {
            message_id: `msg_${Date.now()}`,
            order_id: orderId,
            from_user_id: fromType === 'seller' ? sellerId : buyerId,
            from_type: fromType,
            to_user_id: fromType === 'seller' ? buyerId : sellerId,
            content: message,
            timestamp: new Date().toISOString(),
            read: false,
            read_at: null
        };
        const messages = this.readJson(this.messagesKey, []);
        messages.push(payload);
        this.writeJson(this.messagesKey, messages);
        this.addNotification({
            userId: payload.to_user_id,
            type: 'message',
            title: `Nuevo mensaje en ${orderId}`,
            message: message.length > 72 ? `${message.slice(0, 72)}…` : message
        });
        return payload;
    }

    markMessageAsRead(messageId) {
        const messages = this.readJson(this.messagesKey, []);
        const message = messages.find(item => item.message_id === messageId);
        if (message) {
            message.read = true;
            message.read_at = new Date().toISOString();
            this.writeJson(this.messagesKey, messages);
        }
    }
}

const orderManagementService = new OrderManagementService();
