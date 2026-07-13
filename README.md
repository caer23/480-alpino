# Cota 480 - Ecommerce de Equipamiento de Nieve

Tienda online especializada en compra y venta de artículos premium para deportes de nieve.

## Características

- 🛒 Carrito de compras completo
- 🔍 Buscador de productos
- 📊 Vista en cuadrícula responsive
- ⚙️ Configurador de equipamiento personalizado
- 🎨 Diseño moderno y limpio
- 📱 Completamente responsive

## Estructura del Proyecto

```
480-alpino/
├── index.html
├── styles/
│   ├── main.css
│   ├── navbar.css
│   ├── hero.css
│   ├── grid.css
│   ├── configurador.css
│   ├── footer.css
│   ├── cart.css
│   ├── search.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── services/
│   │   ├── cart.js
│   │   ├── products.js
│   │   └── search.js
│   ├── components/
│   │   ├── navbar.js
│   │   ├── hero.js
│   │   ├── grid.js
│   │   ├── configurador.js
│   │   ├── categories.js
│   │   ├── footer.js
│   │   ├── cart.js
│   │   ├── notifications.js
│   │   └── search.js
│   └── app.js
└── README.md
```

## Desarrollo

Cada componente está separado en archivos individuales para facilitar el mantenimiento y las correcciones.

### Utils (Utilidades)
- `constants.js` - Constantes y configuración global
- `helpers.js` - Funciones auxiliares reutilizables

### Services (Servicios)
- `cart.js` - Lógica del carrito de compras
- `products.js` - Gestión de productos
- `search.js` - Lógica de búsqueda

### Components (Componentes)
- `navbar.js` - Barra de navegación
- `hero.js` - Sección hero principal
- `grid.js` - Vista en cuadrícula de productos
- `configurador.js` - Configurador de equipamiento
- `categories.js` - Sección de categorías
- `footer.js` - Pie de página
- `cart.js` - Interfaz del carrito
- `notifications.js` - Sistema de notificaciones
- `search.js` - Interfaz del buscador

## Uso

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. ¡Listo! La aplicación estará corriendo

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)

## Paleta de Colores

- Azul Marino Principal: `#1a3a47`
- Azul Marino Secundario: `#2d5a6f`
- Beige Claro: `#E8D5C4`
- Fondo: `#f5f5f5`

## License

MIT