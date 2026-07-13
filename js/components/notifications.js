/**
 * COMPONENTE: NOTIFICACIONES
 * Sistema de notificaciones
 */

class NotificacionesComponent {
    static mostrar(mensaje, tipo = 'info', duracion = 3000) {
        const container = getElement('#notificationsContainer');
        if (!container) return;

        const notificacion = this.crearNotificacion(mensaje, tipo);
        container.appendChild(notificacion);

        // Animación de entrada
        setTimeout(() => {
            addClass(notificacion, 'show');
        }, 10);

        // Auto-remover
        setTimeout(() => {
            removeClass(notificacion, 'show');
            setTimeout(() => {
                notificacion.remove();
            }, 300);
        }, duracion);
    }

    static crearNotificacion(mensaje, tipo) {
        const notificacion = createElement('div', 
            { class: `notificacion notificacion-${tipo}` },
            mensaje
        );
        return notificacion;
    }
}

// Alias para usar en toda la aplicación
window.NotificacionesComponent = NotificacionesComponent;