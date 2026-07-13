/**
 * SERVICIO DE PRODUCTOS
 * Gestiona la lógica y datos de productos
 */

class ProductosService {
    constructor() {
        this.productos = PRODUCTOS_DESTACADOS;
        this.categorias = CATEGORIAS;
    }

    /**
     * Obtiene todos los productos
     * @returns {Array}
     */
    obtenerTodos() {
        return [...this.productos];
    }

    /**
     * Obtiene un producto por ID
     * @param {number} id - ID del producto
     * @returns {Object|null}
     */
    obtenerPorId(id) {
        return this.productos.find(producto => producto.id === id) || null;
    }

    /**
     * Obtiene productos por categoría
     * @param {string} categoria - Nombre de la categoría
     * @returns {Array}
     */
    obtenerPorCategoria(categoria) {
        return this.productos.filter(producto => 
            producto.categoria.toLowerCase() === categoria.toLowerCase()
        );
    }

    /**
     * Busca productos
     * @param {string} termino - Término de búsqueda
     * @returns {Array}
     */
    buscar(termino) {
        return filtrarProductos(this.productos, termino);
    }

    /**
     * Obtiene todas las categorías
     * @returns {Array}
     */
    obtenerCategorias() {
        return [...this.categorias];
    }

    /**
     * Obtiene una categoría por ID
     * @param {number} id - ID de la categoría
     * @returns {Object|null}
     */
    obtenerCategoriaPorId(id) {
        return this.categorias.find(cat => cat.id === id) || null;
    }

    /**
     * Obtiene productos destacados
     * @param {number} cantidad - Cantidad a retornar
     * @returns {Array}
     */
    obtenerDestacados(cantidad = 6) {
        return this.productos.slice(0, cantidad);
    }

    /**
     * Ordena productos
     * @param {Array} productos - Array de productos
     * @param {string} criterio - 'precio-asc', 'precio-desc', 'nombre'
     * @returns {Array}
     */
    ordenar(productos, criterio = 'nombre') {
        const copia = [...productos];

        switch (criterio) {
            case 'precio-asc':
                return copia.sort((a, b) => a.precio - b.precio);
            case 'precio-desc':
                return copia.sort((a, b) => b.precio - a.precio);
            case 'nombre':
                return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
            default:
                return copia;
        }
    }

    /**
     * Filtra productos por rango de precio
     * @param {Array} productos - Array de productos
     * @param {number} minPrecio - Precio mínimo
     * @param {number} maxPrecio - Precio máximo
     * @returns {Array}
     */
    filtrarPorPrecio(productos, minPrecio = 0, maxPrecio = Infinity) {
        return productos.filter(producto => 
            producto.precio >= minPrecio && producto.precio <= maxPrecio
        );
    }
}

// Instancia global del servicio de productos
const productosService = new ProductosService();