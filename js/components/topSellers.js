/**
 * COMPONENTE: TOP SELLERS
 * Sección de los mejores vendedores con carrouseles de productos
 */

class TopSellersComponent {
    constructor() {
        this.container = getElement('#topSellers');
        this.topSellers = this.generarTopSellers();
        this.init();
    }

    init() {
        this.render();
    }

    generarTopSellers() {
        return [
            {
                nombre: 'MontañaShop',
                descripcion: 'Especialistas en equipamiento de alta montaña',
                ventas: 842,
                productos: [
                    { nombre: 'Campera Gore-Tex Summit', marca: 'Arc\'teryx', talle: 'M', precio: 580 },
                    { nombre: 'Pantalón Salopette Pro', marca: 'Salomon', talle: 'L', precio: 310 },
                    { nombre: 'Casco Ski Race', marca: 'POC', talle: 'L', precio: 220 },
                    { nombre: 'Guantes Heli Pro', marca: 'Hestra', talle: 'M', precio: 135 },
                    { nombre: 'Botas Freeride 130', marca: 'Lange', talle: '27.5', precio: 490 },
                    { nombre: 'Gafas Photochromic', marca: 'Oakley', talle: 'Único', precio: 195 }
                ]
            },
            {
                nombre: 'NieveExpert',
                descripcion: 'Equipo técnico para riders exigentes',
                ventas: 754,
                productos: [
                    { nombre: 'Tabla All Mountain 162', marca: 'Burton', talle: '162', precio: 650 },
                    { nombre: 'Fijaciones Cartel X', marca: 'Burton', talle: 'M', precio: 280 },
                    { nombre: 'Botas Photon Boa', marca: 'Burton', talle: '27', precio: 370 },
                    { nombre: 'Campera Softshell', marca: 'Patagonia', talle: 'XL', precio: 340 },
                    { nombre: 'Pantalón Impermeab.', marca: 'The North Face', talle: 'M', precio: 265 },
                    { nombre: 'Buff Merino Lana', marca: 'Buff', talle: 'Único', precio: 45 }
                ]
            },
            {
                nombre: 'AlpineGear',
                descripcion: 'Ropa y accesorios para el invierno',
                ventas: 698,
                productos: [
                    { nombre: 'Mochila 30L Powder', marca: 'Deuter', talle: '30L', precio: 185 },
                    { nombre: 'Polera Térmica Base', marca: 'Icebreaker', talle: 'S', precio: 95 },
                    { nombre: 'Chaleco Acolchado', marca: 'Columbia', talle: 'M', precio: 120 },
                    { nombre: 'Medias Ski Merino', marca: 'Smartwool', talle: 'M', precio: 38 },
                    { nombre: 'Cinto Porta-Esquís', marca: 'K2', talle: 'Único', precio: 55 },
                    { nombre: 'Campera Puffer 700', marca: 'Marmot', talle: 'L', precio: 290 }
                ]
            }
        ];
    }

    renderProducto(producto) {
        return `
            <article class="seller-product-card">
                <h4>${producto.nombre}</h4>
                <p><strong>Marca:</strong> ${producto.marca}</p>
                <p><strong>Talle:</strong> ${producto.talle}</p>
                <p class="seller-product-price">${formatearMoneda(producto.precio)}</p>
            </article>
        `;
    }

    renderTopSeller(seller) {
        const productosHTML = seller.productos.map(p => this.renderProducto(p)).join('');
        return `
            <article class="seller-carousel top-seller-carousel">
                <header class="seller-carousel-header">
                    <div class="top-seller-info">
                        <h3>${seller.nombre}</h3>
                        <p class="top-seller-desc">${seller.descripcion}</p>
                    </div>
                    <span class="seller-badge top-seller-badge">⭐ Top Seller</span>
                </header>
                <div class="seller-products-track">
                    ${productosHTML}
                </div>
            </article>
        `;
    }

    render() {
        if (!this.container) return;

        const sellersHTML = this.topSellers.map(s => this.renderTopSeller(s)).join('');

        this.container.innerHTML = `
            <div class="container">
                <h2 class="top-sellers-title">Top Sellers</h2>
                <p class="sellers-subtitle">Los vendedores más destacados de la temporada.</p>
                <div class="sellers-list top-sellers-list">
                    ${sellersHTML}
                </div>
            </div>
        `;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TopSellersComponent();
    });
} else {
    new TopSellersComponent();
}
