/**
 * ARCHIVO PRINCIPAL DE LA APLICACIÓN
 * Inicialización global y configuración
 */

console.log('🏔️ 480 Alpino - Ecommerce cargado correctamente');

// Inicialización cuando todo está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
    });
} else {
    initApp();
}

function initApp() {
    console.log('Inicializando aplicación...');
    
    // Verificar que los servicios estén disponibles
    if (typeof carritoService !== 'undefined') {
        console.log('✓ Carrito service cargado');
    }
    
    if (typeof productosService !== 'undefined') {
        console.log('✓ Productos service cargado');
    }
    
    if (typeof searchService !== 'undefined') {
        console.log('✓ Search service cargado');
    }
    
    console.log('✓ Aplicación lista');
}

// Event listener global para tecla ESC (cerrar modales)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Cerrar carrito
        const cartSidebar = getElement('#cartSidebar');
        if (cartSidebar && hasClass(cartSidebar, 'open')) {
            document.dispatchEvent(new CustomEvent('openCart'));
        }
        
        // Cerrar búsqueda
        const searchModal = getElement('#searchModal');
        if (searchModal && hasClass(searchModal, 'open')) {
            document.dispatchEvent(new CustomEvent('openSearch'));
        }
    }
});