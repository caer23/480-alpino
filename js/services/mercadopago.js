/**
 * SERVICIO MERCADOPAGO (MVP)
 * Integración cliente para crear preferencias y simular redirección segura.
 */

const MERCADOPAGO_PUBLIC_KEY = (window.__ENV__ && window.__ENV__.MERCADOPAGO_PUBLIC_KEY) || 'APP_USR-xxxxxxxxx';
const MERCADOPAGO_ACCESS_TOKEN = (window.__ENV__ && window.__ENV__.MERCADOPAGO_ACCESS_TOKEN) || 'APP_USR-xxxxxxxxx';
const MERCADOPAGO_WEBHOOK_URL = (window.__ENV__ && window.__ENV__.MERCADOPAGO_WEBHOOK_URL) || 'https://tudominio.com/webhooks/mercadopago';

class MercadoPagoService {
    constructor() {
        this.sdkInitialized = false;
    }

    initMercadoPago() {
        this.sdkInitialized = true;
        return {
            publicKey: MERCADOPAGO_PUBLIC_KEY,
            initializedAt: new Date().toISOString()
        };
    }

    createPaymentPreference({ order, payer, shipment, metadata, backUrls }) {
        if (!this.sdkInitialized) {
            this.initMercadoPago();
        }

        if (!order || !order.order_id) {
            throw new Error('Orden inválida para crear preferencia de pago');
        }

        const items = order.items.map(item => ({
            title: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            currency_id: 'ARS'
        }));

        const preferenceId = `pref_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const successUrl = (backUrls?.success || 'order-confirmation.html') +
            `${(backUrls?.success || '').includes('?') ? '&' : '?'}order_id=${encodeURIComponent(order.order_id)}&payment_status=approved&payment_id=${preferenceId}`;

        return {
            id: preferenceId,
            init_point: successUrl,
            sandbox_init_point: successUrl,
            request: {
                items,
                payer: {
                    email: payer?.email,
                    name: payer?.name
                },
                shipment,
                metadata: {
                    order_id: order.order_id,
                    user_id: order.user_id,
                    ...metadata
                },
                back_urls: backUrls,
                notification_url: MERCADOPAGO_WEBHOOK_URL
            }
        };
    }

    redirectToPayment(preference) {
        if (!preference?.init_point) {
            throw new Error('Preferencia de pago inválida');
        }

        window.location.href = preference.init_point;
    }

    validatePaymentStatus(status) {
        const normalized = String(status || '').toLowerCase();
        return {
            isApproved: normalized === 'approved',
            isPending: normalized === 'pending' || normalized === '',
            isRejected: normalized === 'rejected' || normalized === 'failure',
            normalized
        };
    }

    handlePaymentNotification(notification = {}) {
        const paymentStatus = this.validatePaymentStatus(notification.status);
        return {
            processed: true,
            order_id: notification.order_id,
            payment_id: notification.payment_id,
            status: paymentStatus.normalized || 'pending',
            approved: paymentStatus.isApproved,
            received_at: new Date().toISOString()
        };
    }
}

const mercadoPagoService = new MercadoPagoService();
