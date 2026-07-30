/**
 * SERVICIO DE MENSAJERÍA DE PEDIDOS
 */
class MessagingService {
    sendMessage(orderId, message, fromType = 'buyer') {
        if (!String(message || '').trim()) {
            throw new Error('Escribí un mensaje antes de enviarlo.');
        }
        return orderManagementService.sendMessage(orderId, String(message).trim(), fromType);
    }

    getMessages(orderId) {
        return orderManagementService.getMessages(orderId);
    }

    markAsRead(messageId) {
        return orderManagementService.markMessageAsRead(messageId);
    }
}

const messagingService = new MessagingService();
