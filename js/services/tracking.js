/**
 * SERVICIO DE TRACKING
 */
class TrackingService {
    getTrackingInfo(trackingNumber, carrier = 'OCA') {
        const orders = orderManagementService.getOrders();
        const order = orders.find(item => item.shipment.tracking_number === trackingNumber && item.shipment.carrier === carrier);
        if (!order) {
            return {
                trackingNumber,
                carrier,
                tracking_url: trackingNumber ? `https://www.oca.com.ar/seguimiento?pieza=${encodeURIComponent(trackingNumber)}` : '#',
                events: []
            };
        }
        return {
            trackingNumber,
            carrier,
            tracking_url: order.shipment.tracking_url,
            events: order.shipment.events || []
        };
    }
}

const trackingService = new TrackingService();
