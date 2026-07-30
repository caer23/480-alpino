const express = require('express');
const mercadoPagoService = require('../services/mercadopago.service');

const router = express.Router();

const requestsByIp = new Map();
const MAX_REQUESTS_PER_MINUTE = 30;

function rateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const state = requestsByIp.get(ip) || { count: 0, resetAt: now + 60000 };

    if (now > state.resetAt) {
        state.count = 0;
        state.resetAt = now + 60000;
    }

    state.count += 1;
    requestsByIp.set(ip, state);

    if (state.count > MAX_REQUESTS_PER_MINUTE) {
        return res.status(429).json({ error: 'Demasiadas solicitudes. Reintentá en un minuto.' });
    }

    next();
}

router.post('/create-preference', rateLimit, async (req, res) => {
    try {
        const { items, payer, shipment, metadata, backUrls } = req.body || {};

        const preference = await mercadoPagoService.createPreference({
            items,
            payer,
            shipment,
            metadata,
            backUrls,
            notificationUrl: process.env.MERCADOPAGO_WEBHOOK_URL
        });

        res.json({ id: preference.id, init_point: preference.init_point, sandbox_init_point: preference.sandbox_init_point });
    } catch (error) {
        res.status(400).json({ error: error.message || 'No se pudo crear la preferencia' });
    }
});

router.post('/webhook', rateLimit, async (req, res) => {
    try {
        const signature = req.get('x-signature') || req.get('x-hub-signature');
        const requestId = req.get('x-request-id');
        const isValid = mercadoPagoService.validateWebhookSignature({
            body: req.body,
            signatureHeader: signature,
            requestId
        });

        if (!isValid) {
            return res.status(401).json({ error: 'Firma de webhook inválida' });
        }

        const result = await mercadoPagoService.processNotification(req.body);

        res.status(200).json({ ok: true, payment: result });
    } catch (error) {
        res.status(400).json({ error: error.message || 'No se pudo procesar el webhook' });
    }
});

module.exports = router;
