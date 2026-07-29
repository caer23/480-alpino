/**
 * COMPONENTE: CARROUSELES DE VENDEDORES PRIVILEGIADOS
 * Sección de vendedores destacados con scroll horizontal de productos
 */

class SellersCarouselComponent {
    constructor() {
        this.containerFirst = getElement('#privilegedSellersFirst');
        this.containerRest = getElement('#privilegedSellersRest');
        this.vendedores = this.generarVendedores(20);
        this.init();
    }

    init() {
        this.render();
    }

    generarVendedores(cantidad) {
        const nombresVendedores = Array.from({ length: cantidad }, (_, index) => `Vendedor Privilegiado ${index + 1}`);
        const productosBase = [
            { nombre: 'Campera Alpine Pro', marca: 'Cota', talle: 'M', precio: 320 },
            { nombre: 'Pantalón Snow Tech', marca: 'NorthLine', talle: 'L', precio: 240 },
            { nombre: 'Guantes Thermal Grip', marca: 'FrostPeak', talle: 'S', precio: 90 },
            { nombre: 'Tabla Summit 158', marca: 'RideOn', talle: '158', precio: 560 },
            { nombre: 'Campera Softshell Wind', marca: 'IceGuard', talle: 'XL', precio: 280 },
            { nombre: 'Pantalón Storm Shield', marca: 'Glacier', talle: 'M', precio: 210 }
        ];

        return nombresVendedores.map((vendedor, index) => ({
            nombre: vendedor,
            productos: productosBase.map((producto, productoIndex) => ({
                ...producto,
                nombre: `${producto.nombre} ${index + 1}-${productoIndex + 1}`,
                precio: producto.precio + (index * 5)
            }))
        }));
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

    renderCarrusel(vendedor) {
        const productosHTML = vendedor.productos.map(producto => this.renderProducto(producto)).join('');

        return `
            <article class="seller-carousel">
                <header class="seller-carousel-header">
                    <h3>${vendedor.nombre}</h3>
                    <span class="seller-badge">Privilegiado</span>
                </header>
                <div class="seller-products-track">
                    ${productosHTML}
                </div>
            </article>
        `;
    }

    render() {
        const primerosCinco = this.vendedores.slice(0, 5);
        const restantes = this.vendedores.slice(5);

        if (this.containerFirst) {
            const carouselesHTMLFirst = primerosCinco.map(vendedor => this.renderCarrusel(vendedor)).join('');
            this.containerFirst.innerHTML = `
                <div class="container">
                    <h2>Vendedores privilegiados</h2>
                    <p class="sellers-subtitle">Espacios premium para vendedores que potencian su visibilidad en temporada.</p>
                    <div class="sellers-list">
                        ${carouselesHTMLFirst}
                    </div>
                </div>
            `;
        }

        if (this.containerRest) {
            const carouselesHTMLRest = restantes.map(vendedor => this.renderCarrusel(vendedor)).join('');
            this.containerRest.innerHTML = `
                <div class="container">
                    <div class="sellers-list">
                        ${carouselesHTMLRest}
                    </div>
                </div>
            `;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SellersCarouselComponent();
    });
} else {
    new SellersCarouselComponent();
}
