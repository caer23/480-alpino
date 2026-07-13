/**
 * SERVICIO DE CARRITO DE COMPRAS
 * Gestiona la lógica del carrito de compras
 */

class CarritoService {
    constructor() {
        this.items = this.cargarDelStorage();
        this.listeners = [];
    }

    /**
     * Carga el carrito desde localStorage
     */
    cargarDelStorage() {
        try {
            const storedCart = localStorage.getItem('480_carrito');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            return [];
        }
    }

    /**
     * Guarda el carrito en localStorage
     */
    guardarEnStorage() {
        try {
            localStorage.setItem('480_carrito', JSON.stringify(this.items));
            this.notificarCambios();
        } catch (error) {
            console.error('Error al guardar carrito:', error);
        }
    }

    /**
     * Agrega un producto al carrito
     * @param {Object} producto - Producto a agregar
     * @param {number} cantidad - Cantidad
     */
    agregarProducto(producto, cantidad = 1) {
        if (!producto || !esNumeroValido(cantidad)) return;

        const itemExistente = this.items.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({
                ...producto,
                cantidad: cantidad
            });
        }

        this.guardarEnStorage();
    }

    /**
     * Remueve un producto del carrito
     * @param {number} productId - ID del producto
     */
    removerProducto(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.guardarEnStorage();
    }

    /**
     * Actualiza la cantidad de un producto
     * @param {number} productId - ID del producto
     * @param {number} cantidad - Nueva cantidad
     */
    actualizarCantidad(productId, cantidad) {
        if (!esNumeroValido(cantidad)) return;

        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (cantidad <= 0) {
                this.removerProducto(productId);
            } else {
                item.cantidad = cantidad;
                this.guardarEnStorage();
            }
        }
    }

    /**
     * Vacía el carrito
     */
    vaciar() {
        this.items = [];
        this.guardarEnStorage();
    }

    /**
     * Obtiene todos los items del carrito
     * @returns {Array}
     */
    obtenerItems() {
        return [...this.items];
    }

    /**
     * Obtiene la cantidad total de items
     * @returns {number}
     */
    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    /**
     * Obtiene el total del carrito
     * @returns {number}
     */
    obtenerTotal() {
        return calcularTotal(this.items);
    }

    /**
     * Verifica si el carrito está vacío
     * @returns {boolean}
     */
    estaVacio() {
        return this.items.length === 0;
    }

    /**
     * Obtiene un producto específico
     * @param {number} productId - ID del producto
     * @returns {Object|null}
     */
    obtenerProducto(productId) {
        return this.items.find(item => item.id === productId) || null;
    }

    /**
     * Suscribe un listener a cambios del carrito
     * @param {Function} callback - Función a ejecutar
     */
    suscribirse(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notifica a los listeners de cambios
     */
    notificarCambios() {
        this.listeners.forEach(callback => {
            try {
                callback(this.obtenerItems());
            } catch (error) {
                console.error('Error en listener del carrito:', error);
            }
        });
    }
}

// Instancia global del servicio de carrito
const carritoService = new CarritoService();