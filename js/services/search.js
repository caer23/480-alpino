/**
 * SERVICIO DE BÚSQUEDA
 * Gestiona la lógica de búsqueda de productos
 */

class SearchService {
    constructor() {
        this.terminoActual = '';
        this.resultados = [];
        this.listeners = [];
    }

    /**
     * Realiza una búsqueda
     * @param {string} termino - Término de búsqueda
     * @returns {Array} Resultados
     */
    buscar(termino) {
        this.terminoActual = termino.trim();

        if (!this.terminoActual) {
            this.resultados = [];
        } else {
            this.resultados = productosService.buscar(this.terminoActual);
        }

        this.notificarCambios();
        return this.resultados;
    }

    /**
     * Obtiene los resultados actuales
     * @returns {Array}
     */
    obtenerResultados() {
        return [...this.resultados];
    }

    /**
     * Obtiene el término de búsqueda actual
     * @returns {string}
     */
    obtenerTermino() {
        return this.terminoActual;
    }

    /**
     * Obtiene la cantidad de resultados
     * @returns {number}
     */
    obtenerCantidadResultados() {
        return this.resultados.length;
    }

    /**
     * Limpia la búsqueda
     */
    limpiar() {
        this.terminoActual = '';
        this.resultados = [];
        this.notificarCambios();
    }

    /**
     * Suscribe un listener a cambios de búsqueda
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
                callback(this.obtenerResultados());
            } catch (error) {
                console.error('Error en listener de búsqueda:', error);
            }
        });
    }
}

// Instancia global del servicio de búsqueda
const searchService = new SearchService();