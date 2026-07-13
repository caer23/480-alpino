/**
 * FUNCIONES AUXILIARES
 * Funciones reutilizables en toda la aplicación
 */

/**
 * Formatea un número como moneda USD
 * @param {number} valor - Valor a formatear
 * @returns {string} Valor formateado
 */
function formatearMoneda(valor) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(valor);
}

/**
 * Obtiene un elemento del DOM con validación
 * @param {string} selector - Selector CSS
 * @returns {HTMLElement|null} Elemento encontrado o null
 */
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Elemento no encontrado: ${selector}`);
    }
    return element;
}

/**
 * Obtiene múltiples elementos del DOM
 * @param {string} selector - Selector CSS
 * @returns {NodeList} Lista de elementos
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Crea un elemento HTML con atributos
 * @param {string} tag - Etiqueta HTML
 * @param {Object} attributes - Atributos del elemento
 * @param {string} content - Contenido del elemento
 * @returns {HTMLElement} Elemento creado
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'style') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (content) {
        element.innerHTML = content;
    }
    
    return element;
}

/**
 * Agrega una clase a un elemento
 * @param {HTMLElement} element - Elemento
 * @param {string} className - Nombre de la clase
 */
function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remueve una clase de un elemento
 * @param {HTMLElement} element - Elemento
 * @param {string} className - Nombre de la clase
 */
function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Verifica si un elemento tiene una clase
 * @param {HTMLElement} element - Elemento
 * @param {string} className - Nombre de la clase
 * @returns {boolean}
 */
function hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
}

/**
 * Establece atributos en un elemento
 * @param {HTMLElement} element - Elemento
 * @param {Object} attributes - Objeto con atributos
 */
function setAttributes(element, attributes) {
    if (!element) return;
    
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}

/**
 * Realiza un scroll suave a un elemento
 * @param {HTMLElement|string} target - Elemento o selector
 * @param {number} offset - Offset en pixels
 */
function smoothScroll(target, offset = 0) {
    const element = typeof target === 'string' ? getElement(target) : target;
    
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/**
 * Debounce para funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Retraso en ms
 * @returns {Function}
 */
function debounce(func, delay = 300) {
    let timeoutId;
    
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Throttle para funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Retraso mínimo en ms
 * @returns {Function}
 */
function throttle(func, delay = 300) {
    let lastCall = 0;
    
    return function (...args) {
        const now = Date.now();
        
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

/**
 * Valida si un valor es un número válido
 * @param {*} value - Valor a validar
 * @returns {boolean}
 */
function esNumeroValido(value) {
    return !isNaN(value) && isFinite(value) && value > 0;
}

/**
 * Obtiene el scroll position del documento
 * @returns {Object} {x, y}
 */
function getScrollPosition() {
    return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset
    };
}

/**
 * Verifica si un elemento es visible en el viewport
 * @param {HTMLElement} element - Elemento
 * @returns {boolean}
 */
function isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
    );
}

/**
 * Filtra un array de productos por término de búsqueda
 * @param {Array} productos - Array de productos
 * @param {string} termino - Término de búsqueda
 * @returns {Array} Productos filtrados
 */
function filtrarProductos(productos, termino) {
    if (!termino) return productos;
    
    const terminoLower = termino.toLowerCase();
    return productos.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.descripcion.toLowerCase().includes(terminoLower) ||
        producto.categoria.toLowerCase().includes(terminoLower)
    );
}

/**
 * Calcula el total de un array de items con precio
 * @param {Array} items - Array de items
 * @returns {number} Total
 */
function calcularTotal(items) {
    return items.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
}