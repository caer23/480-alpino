/**
 * CONSTANTES GLOBALES DEL PROYECTO
 * Archivo centralizado para todas las constantes usadas en la aplicación
 */

const COLORS = {
    PRIMARY_DARK: '#1a3a47',
    PRIMARY_MEDIUM: '#2d5a6f',
    ACCENT_LIGHT: '#E8D5C4',
    BACKGROUND: '#f5f5f5',
    WHITE: '#ffffff',
    TEXT_DARK: '#333333',
    TEXT_LIGHT: '#666666',
    BORDER: '#cccccc',
    ERROR: '#d32f2f',
    SUCCESS: '#388e3c'
};

const PRODUCTOS_DESTACADOS = [
    {
        id: 1,
        nombre: "Tabla Snowboard '480 SUMMIT'",
        precio: 550.00,
        imagen: 'https://via.placeholder.com/250x250?text=Snowboard',
        categoria: 'tablas',
        descripcion: 'Tabla premium para principiantes y intermedios'
    },
    {
        id: 2,
        nombre: "Antiparras '480 VISION PRO'",
        precio: 195.00,
        imagen: 'https://via.placeholder.com/250x250?text=Gafas',
        categoria: 'optica',
        descripcion: 'Gafas de esquí con tecnología anti-reflejo'
    },
    {
        id: 3,
        nombre: "Kit Splitboard '480 EXPLORE'",
        precio: 890.00,
        imagen: 'https://via.placeholder.com/250x250?text=Kit',
        categoria: 'kits',
        descripcion: 'Kit completo para esquí alpino'
    },
    {
        id: 4,
        nombre: "Botas '480 PRO'",
        precio: 320.00,
        imagen: 'https://via.placeholder.com/250x250?text=Botas',
        categoria: 'botas',
        descripcion: 'Botas especializadas de alto rendimiento'
    },
    {
        id: 5,
        nombre: "Fijaciones '480 ELITE'",
        precio: 280.00,
        imagen: 'https://via.placeholder.com/250x250?text=Fijaciones',
        categoria: 'fijaciones',
        descripcion: 'Fijaciones de seguridad profesionales'
    },
    {
        id: 6,
        nombre: "Casco '480 SHIELD'",
        precio: 210.00,
        imagen: 'https://via.placeholder.com/250x250?text=Casco',
        categoria: 'proteccion',
        descripcion: 'Casco certificado con ventilación avanzada'
    }
];

const CATEGORIAS = [
    { id: 1, nombre: 'TABLAS', icono: '🏂', descripcion: 'Snowboards y splitboards' },
    { id: 2, nombre: 'ÓPTICA', icono: '👓', descripcion: 'Gafas y antiparras' },
    { id: 3, nombre: 'BOTAS', icono: '👢', descripcion: 'Botas especializadas' },
    { id: 4, nombre: 'PROTECCIÓN', icono: '🛡️', descripcion: 'Cascos y pads' },
    { id: 5, nombre: 'ACCESORIOS', icono: '🧤', descripcion: 'Guantes y ropa' },
    { id: 6, nombre: 'ESQUÍ', icono: '🎿', descripcion: 'Equipamiento de esquí' }
];

const CONFIGURADOR_OPCIONES = {
    nivel: [
        'Principiante',
        'Intermedio',
        'Avanzado',
        'Profesional'
    ],
    altura: [
        '150 cm - 160 cm',
        '160 cm - 170 cm',
        '170 cm - 180 cm',
        '180 cm - 190 cm',
        '190 cm +'
    ],
    terreno: [
        'Pista',
        'All Mountain',
        'Fuera de Pista',
        'Parque'
    ]
};

const MENSAJES = {
    PRODUCTO_AGREGADO: 'Producto agregado al carrito',
    CARRITO_VACIO: 'Tu carrito está vacío',
    PRODUCTO_ELIMINADO: 'Producto eliminado del carrito',
    BUSQUEDA_VACIA: 'Ingresa un término de búsqueda',
    SIN_RESULTADOS: 'No se encontraron resultados',
    ERROR_GENERICO: 'Ocurrió un error. Intenta nuevamente'
};

const ANIMACIONES = {
    VELOCIDAD_CORTA: 300,
    VELOCIDAD_MEDIA: 500,
    VELOCIDAD_LARGA: 800
};