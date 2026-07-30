/**
 * SERVICIO DE EMAIL (MVP)
 * Simula envío por proveedor externo y deja trazabilidad en localStorage.
 */

const EMAIL_SERVICE = (window.__ENV__ && window.__ENV__.EMAIL_SERVICE) || 'sendgrid';
const EMAIL_API_KEY = (window.__ENV__ && window.__ENV__.EMAIL_API_KEY) || 'xxxxxx';
const EMAIL_FROM = (window.__ENV__ && window.__ENV__.EMAIL_FROM) || 'noreply@cota480.com';

class EmailService {
    constructor() {
        this.logKey = '480_email_log';
    }

    getLogs() {
        try {
            return JSON.parse(localStorage.getItem(this.logKey) || '[]');
        } catch (error) {
            return [];
        }
    }

    saveLogs(logs) {
        localStorage.setItem(this.logKey, JSON.stringify(logs));
    }

    async sendEmail({ to, subject, template, payload }) {
        if (!to || !subject || !template) {
            throw new Error('Faltan datos para enviar email');
        }

        const log = {
            id: `email_${Date.now()}`,
            to,
            from: EMAIL_FROM,
            subject,
            template,
            provider: EMAIL_SERVICE,
            status: 'sent',
            sent_at: new Date().toISOString(),
            payload
        };

        const logs = this.getLogs();
        logs.unshift(log);
        this.saveLogs(logs);

        return log;
    }

    sendOrderConfirmation(order) {
        return this.sendEmail({
            to: order.user_email,
            subject: `Confirmación de compra ${order.order_id}`,
            template: 'order-confirmation.html',
            payload: {
                order_id: order.order_id,
                total: order.total,
                estimated_delivery: order.shipment.estimated_delivery
            }
        });
    }

    sendPaymentConfirmed(order) {
        return this.sendEmail({
            to: order.user_email,
            subject: `Pago aprobado ${order.order_id}`,
            template: 'payment-confirmed.html',
            payload: {
                order_id: order.order_id,
                payment_status: order.payment.status,
                paid_at: order.payment.paid_at
            }
        });
    }

    sendShipmentNotification(order) {
        return this.sendEmail({
            to: order.user_email,
            subject: `Tu pedido ya fue enviado ${order.order_id}`,
            template: 'shipment-notification.html',
            payload: {
                order_id: order.order_id,
                tracking_number: order.shipment.tracking_number,
                carrier: order.shipment.carrier
            }
        });
    }
}

const emailService = new EmailService();
