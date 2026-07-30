/**
 * Servicio backend MercadoPago (Node/Express)
 */

const crypto = require('crypto');

class MercadoPagoBackendService {
    constructor() {
        this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-xxxxxxxxx';
        this.webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET || 'change-me';
    }

    async createPreference({ items, payer, shipment, metadata, backUrls, notificationUrl }) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('No hay items para crear la preferencia');
        }

        return {
            id: `pref_${Date.now()}`,
            init_point: backUrls?.success,
            sandbox_init_point: backUrls?.success,
            items,
            payer,
            shipment,
            metadata,
            back_urls: backUrls,
            notification_url: notificationUrl
        };
    }

    validateWebhookSignature({ body, signatureHeader, requestId }) {
        if (!signatureHeader) return false;

        const payload = `${requestId || ''}.${JSON.stringify(body)}`;
        const digest = crypto
            .createHmac('sha256', this.webhookSecret)
            .update(payload)
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(digest),
            Buffer.from(String(signatureHeader))
        );
    }

    async processNotification(notification) {
        const paymentId = notification?.data?.id || notification?.id;

        return {
            payment_id: String(paymentId || ''),
            status: notification?.status || 'pending',
            approved: String(notification?.status || '').toLowerCase() === 'approved',
            processed_at: new Date().toISOString()
        };
    }
}

module.exports = new MercadoPagoBackendService();
