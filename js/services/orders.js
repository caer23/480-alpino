/**
 * SERVICIO DE ÓRDENES
 * Flujo de compras MVP con localStorage
 */

class OrdersService {
    constructor() {
        this.storageKey = '480_orders';
        this.couponKey = '480_checkout_coupon';
        this.shippingMethods = {
            standard: { label: 'Standard', days: '5-7 días', cost: 1500 },
            express: { label: 'Express', days: '2-3 días', cost: 3500 },
            same_day: { label: 'Mismo día (CABA)', days: 'Hoy', cost: 5000 }
        };
        this.taxRate = 0.21;
        this.validCoupons = {
            NIEVE480: { type: 'percent', value: 0.15, label: '15% OFF' },
            CREW10: { type: 'percent', value: 0.10, label: '10% OFF' },
            BIENVENIDO: { type: 'percent', value: 0.20, label: '20% OFF - Bienvenida' }
        };
    }

    getOrders() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al leer órdenes:', error);
            return [];
        }
    }

    saveOrders(orders) {
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
    }

    generateOrderId() {
        const year = new Date().getFullYear();
        const random = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
        return `480-${year}-${random}`;
    }

    validateCart(items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('El carrito está vacío');
        }
    }

    validateShippingAddress(address = {}) {
        const required = [
            'name',
            'email',
            'phone',
            'province',
            'city',
            'postal_code',
            'address'
        ];

        const missing = required.filter(field => !String(address[field] || '').trim());
        if (missing.length) {
            throw new Error('Completá todos los campos obligatorios de envío');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
            throw new Error('El email ingresado no es válido');
        }
    }

    validatePaymentMethod(payment = {}) {
        const validMethods = ['mercadopago', 'transfer', 'cash_on_delivery'];
        if (!validMethods.includes(payment.method)) {
            throw new Error('Seleccioná un método de pago válido');
        }
    }

    getShippingMethod(method = 'standard') {
        return this.shippingMethods[method] || this.shippingMethods.standard;
    }

    applyDiscount(subtotal, couponCode = '') {
        if (!couponCode) {
            return { code: '', label: '', amount: 0, isValid: false };
        }

        const normalized = couponCode.trim().toUpperCase();
        const coupon = this.validCoupons[normalized];

        if (!coupon) {
            throw new Error('El cupón no es válido o está vencido');
        }

        const amount = coupon.type === 'percent'
            ? Math.round(subtotal * coupon.value)
            : Math.round(coupon.value);

        return {
            code: normalized,
            label: coupon.label,
            amount,
            isValid: true
        };
    }

    setCheckoutCoupon(couponCode = '') {
        const code = String(couponCode || '').trim().toUpperCase();
        if (!code) {
            localStorage.removeItem(this.couponKey);
            return;
        }
        localStorage.setItem(this.couponKey, code);
    }

    getCheckoutCoupon() {
        return localStorage.getItem(this.couponKey) || '';
    }

    reserveStock(items) {
        items.forEach(item => {
            const product = typeof productosService !== 'undefined'
                ? productosService.obtenerPorId(item.product_id)
                : null;

            if (!product || !product.stock) return;

            const sizeKey = item.size && Object.prototype.hasOwnProperty.call(product.stock, item.size)
                ? item.size
                : Object.keys(product.stock)[0];

            const available = Number(product.stock[sizeKey] || 0);
            if (available < item.quantity) {
                throw new Error(`Stock insuficiente para ${item.name}`);
            }

            product.stock[sizeKey] = available - item.quantity;
        });
    }

    createOrder({
        user,
        shippingAddress,
        payment,
        shippingMethod = 'standard',
        items,
        couponCode = ''
    }) {
        this.validateCart(items);
        this.validateShippingAddress(shippingAddress);
        this.validatePaymentMethod(payment);

        const normalizedItems = items.map(item => ({
            product_id: item.id,
            name: item.nombre,
            quantity: Number(item.cantidad || 1),
            unit_price: Number(item.precio),
            subtotal: Number(item.precio) * Number(item.cantidad || 1),
            size: item.talle || null,
            color: item.color || null
        }));

        this.reserveStock(normalizedItems);

        const subtotal = normalizedItems.reduce((acc, item) => acc + item.subtotal, 0);
        const discountInfo = couponCode ? this.applyDiscount(subtotal, couponCode) : { amount: 0, code: '', label: '' };
        const taxableBase = Math.max(subtotal - discountInfo.amount, 0);
        const tax = Math.round(taxableBase * this.taxRate);
        const shipping = this.getShippingMethod(shippingMethod);
        const total = taxableBase + tax + shipping.cost;

        const order = {
            order_id: this.generateOrderId(),
            user_id: user?.id ? `user_${user.id}` : 'guest',
            user_email: user?.email || shippingAddress.email,
            order_date: new Date().toISOString(),
            status: 'pending',
            items: normalizedItems,
            subtotal,
            tax,
            shipping_cost: shipping.cost,
            discount: discountInfo.amount,
            discount_code: discountInfo.code,
            total,
            shipping_address: {
                name: shippingAddress.name,
                email: shippingAddress.email,
                phone: shippingAddress.phone,
                address: shippingAddress.address,
                city: shippingAddress.city,
                province: shippingAddress.province,
                postal_code: shippingAddress.postal_code,
                apartment: shippingAddress.apartment || '',
                instructions: shippingAddress.instructions || ''
            },
            payment: {
                method: payment.method,
                mercadopago_id: null,
                card_last_four: null,
                installments: Number(payment.installments || 1),
                status: 'pending',
                paid_at: null
            },
            shipment: {
                method: shippingMethod,
                carrier: 'OCA',
                tracking_number: null,
                estimated_delivery: shipping.days,
                shipped_at: null
            },
            next_steps: [
                'Vas a recibir un email de confirmación de compra.',
                'Cuando se apruebe el pago, te enviaremos la factura y el seguimiento.'
            ]
        };

        const orders = this.getOrders();
        orders.unshift(order);
        this.saveOrders(orders);

        return order;
    }

    updateOrderStatus(orderId, nextStatus, paymentPatch = null) {
        const orders = this.getOrders();
        const order = orders.find(o => o.order_id === orderId);
        if (!order) throw new Error('Orden no encontrada');

        const allowedTransitions = {
            pending: ['processing', 'rejected', 'completed'],
            processing: ['completed', 'rejected', 'shipped'],
            completed: ['shipped'],
            shipped: [],
            rejected: []
        };

        const current = order.status;
        if (!allowedTransitions[current]?.includes(nextStatus)) {
            throw new Error(`No se puede cambiar estado de ${current} a ${nextStatus}`);
        }

        order.status = nextStatus;

        if (paymentPatch) {
            order.payment = {
                ...order.payment,
                ...paymentPatch
            };
        }

        if (nextStatus === 'completed' && !order.payment.paid_at) {
            order.payment.paid_at = new Date().toISOString();
            order.payment.status = 'approved';
        }

        if (nextStatus === 'shipped' && !order.shipment.shipped_at) {
            order.shipment.shipped_at = new Date().toISOString();
            order.shipment.tracking_number = order.shipment.tracking_number || `OCA-${Math.floor(Math.random() * 90000000 + 10000000)}`;
        }

        this.saveOrders(orders);
        return order;
    }

    getOrder(orderId) {
        return this.getOrders().find(order => order.order_id === orderId) || null;
    }

    getUserOrders(userIdOrEmail) {
        if (!userIdOrEmail) return [];
        return this.getOrders().filter(order => order.user_id === userIdOrEmail || order.user_email === userIdOrEmail);
    }
}

const ordersService = new OrdersService();
