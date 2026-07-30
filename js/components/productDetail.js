/**
 * COMPONENTE: DETALLE DE PRODUCTO
 * Gestiona la landing page de un producto individual
 */

class ProductDetailComponent {
    constructor() {
        this.productId = this.getProductIdFromURL();
        this.producto = null;
        this.selectedSize = null;
        this.selectedColor = null;
        this.quantity = 1;
        this.currentImageIndex = 0;
        this.isFavorite = false;
        this.init();
    }

    getProductIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id')) || null;
    }

    init() {
        if (!this.productId) {
            this.renderError('Producto no encontrado');
            return;
        }

        this.producto = productosService.obtenerPorId(this.productId);

        if (!this.producto) {
            this.renderError('Producto no encontrado');
            return;
        }

        this.isFavorite = this.checkFavorite();
        this.updatePageMeta();
        this.render();
        this.trackRecentlyViewed();
    }

    checkFavorite() {
        try {
            const favs = JSON.parse(localStorage.getItem('cota480_favorites') || '[]');
            return favs.includes(this.productId);
        } catch (e) {
            return false;
        }
    }

    toggleFavorite() {
        try {
            let favs = JSON.parse(localStorage.getItem('cota480_favorites') || '[]');
            if (this.isFavorite) {
                favs = favs.filter(id => id !== this.productId);
                this.isFavorite = false;
            } else {
                favs.push(this.productId);
                this.isFavorite = true;
            }
            localStorage.setItem('cota480_favorites', JSON.stringify(favs));
        } catch (e) {}
    }

    trackRecentlyViewed() {
        try {
            let recents = JSON.parse(localStorage.getItem('cota480_recently_viewed') || '[]');
            recents = recents.filter(id => id !== this.productId);
            recents.unshift(this.productId);
            recents = recents.slice(0, 10);
            localStorage.setItem('cota480_recently_viewed', JSON.stringify(recents));
        } catch (e) {}
    }

    updatePageMeta() {
        const p = this.producto;
        document.title = `${p.nombre} - Cota 480`;
        const metaDesc = document.getElementById('metaDescription');
        if (metaDesc) metaDesc.setAttribute('content', p.descripcion);
        const ogTitle = document.getElementById('ogTitle');
        if (ogTitle) ogTitle.setAttribute('content', p.nombre);
        const ogDesc = document.getElementById('ogDescription');
        if (ogDesc) ogDesc.setAttribute('content', p.descripcion);
        const ogImg = document.getElementById('ogImage');
        if (ogImg) ogImg.setAttribute('content', p.imagen || '');

        // Schema.org
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.nombre,
            description: p.descripcion,
            image: p.imagenes || [p.imagen],
            brand: { '@type': 'Brand', name: p.marca || 'Cota 480' },
            offers: {
                '@type': 'Offer',
                price: p.precio,
                priceCurrency: 'ARS',
                availability: 'https://schema.org/InStock'
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: p.rating,
                reviewCount: p.totalReviews
            }
        };
        const schemaEl = document.getElementById('schemaData');
        if (schemaEl) schemaEl.textContent = JSON.stringify(schema);
    }

    render() {
        this.renderBreadcrumb();
        this.renderDetail();
        this.renderTabs();
        this.renderReviews();
        this.renderRelated();
        this.renderFAQs();
    }

    renderBreadcrumb() {
        const p = this.producto;
        const el = document.getElementById('productBreadcrumb');
        if (!el) return;
        const catLabel = p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1);
        el.innerHTML = `
            <a href="../index.html">Inicio</a>
            <span class="breadcrumb-sep">›</span>
            <a href="search-results.html?category=${p.categoria}">${catLabel}</a>
            <span class="breadcrumb-sep">›</span>
            <span class="breadcrumb-current">${p.nombre}</span>
        `;
    }

    renderDetail() {
        const p = this.producto;
        const container = document.getElementById('productDetailContent');
        if (!container) return;

        const imagenes = p.imagenes || [p.imagen];
        const precioFormatted = this.formatPrice(p.precio);
        const precioOriginalHTML = p.precioOriginal
            ? `<div class="pd-price-original">${this.formatPrice(p.precioOriginal)}</div>` : '';
        const discountHTML = p.descuento
            ? `<div class="pd-price-discount">-${p.descuento}% OFF</div>` : '';
        const stockStatus = this.getStockStatus();
        const starsHTML = this.renderStars(p.rating);
        const colorSelected = this.selectedColor || (p.colores && p.colores[0]) || null;

        container.innerHTML = `
            <!-- Gallery Column -->
            <div class="pd-gallery">
                <div class="pd-gallery-main" id="pdGalleryMain">
                    ${p.descuento ? `<div class="pd-gallery-badge">-${p.descuento}% OFF</div>` : ''}
                    <div class="pd-gallery-actions">
                        <button class="pd-gallery-action-btn" id="pdFavBtn" title="Agregar a favoritos" aria-label="Favoritos">
                            ${this.isFavorite ? '❤️' : '🤍'}
                        </button>
                        <button class="pd-gallery-action-btn" id="pdShareBtn" title="Compartir" aria-label="Compartir">
                            📤
                        </button>
                        <button class="pd-gallery-action-btn" id="pdZoomBtn" title="Ver galería completa" aria-label="Ver galería">
                            🔍
                        </button>
                    </div>
                    <button class="pd-gallery-nav pd-gallery-prev" id="pdGalleryPrev" aria-label="Imagen anterior">&#8249;</button>
                    <img src="${imagenes[0]}" alt="${p.nombre}" id="pdMainImg" loading="eager">
                    <button class="pd-gallery-nav pd-gallery-next" id="pdGalleryNext" aria-label="Imagen siguiente">&#8250;</button>
                    <div class="pd-gallery-indicator" id="pdGalleryIndicator">1 / ${imagenes.length}</div>
                </div>
                <div class="pd-thumbnails" id="pdThumbnails">
                    ${imagenes.map((img, i) => `
                        <div class="pd-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                            <img src="${img}" alt="${p.nombre} ${i+1}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Info Column -->
            <div class="pd-info">
                <!-- Header -->
                <div>
                    <div class="pd-category">${p.categoria.toUpperCase()} › ${p.marca || 'Cota 480'}</div>
                    <h1 class="pd-title">${p.nombre}</h1>
                    <div class="pd-meta">
                        <div class="pd-rating">
                            <span class="pd-stars">${starsHTML}</span>
                            <span class="pd-rating-count">${p.rating} (${p.totalReviews} reseñas)</span>
                        </div>
                        <span class="pd-stock-badge ${stockStatus.cls}">${stockStatus.label}</span>
                    </div>
                </div>

                <!-- Price -->
                <div class="pd-price-block">
                    ${precioOriginalHTML}
                    <div class="pd-price-current">${precioFormatted}</div>
                    ${discountHTML}
                    <div class="pd-price-installments">✅ 12 cuotas sin interés de ${this.formatPrice(Math.round(p.precio/12))}</div>
                    ${p.envio === 'Gratis' ? '<div class="pd-free-shipping">🚚 Envío GRATIS · Llega en ' + p.diasEntrega + ' días hábiles</div>' : ''}
                </div>

                <!-- Variants -->
                <div class="pd-variants">
                    ${this.renderSizeSelector()}
                    ${this.renderColorSelector()}
                </div>

                <!-- Quantity -->
                <div class="pd-quantity-group">
                    <div class="pd-variant-label">Cantidad</div>
                    <div class="pd-quantity-ctrl">
                        <button class="pd-qty-btn" id="pdQtyMinus" aria-label="Reducir cantidad">−</button>
                        <input type="number" class="pd-qty-input" id="pdQtyInput" value="${this.quantity}" min="1" max="10">
                        <button class="pd-qty-btn" id="pdQtyPlus" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <div class="pd-qty-stock" id="pdQtyStock"></div>
                </div>

                <!-- Actions -->
                <div class="pd-actions">
                    <button class="pd-btn-cart" id="pdBtnCart">🛒 Agregar al carrito</button>
                    <button class="pd-btn-buy" id="pdBtnBuy">⚡ Comprar ahora</button>
                    <div class="pd-btn-row">
                        <button class="pd-btn-fav ${this.isFavorite ? 'active' : ''}" id="pdBtnFav">
                            ${this.isFavorite ? '❤️ En favoritos' : '🤍 Agregar a favoritos'}
                        </button>
                        <button class="pd-btn-share" id="pdBtnShare">📤 Compartir</button>
                    </div>
                </div>

                <!-- Trust badges -->
                <div class="pd-trust">
                    <span class="pd-trust-badge">✅ Vendedor verificado</span>
                    <span class="pd-trust-badge">🔒 Compra 100% segura</span>
                    <span class="pd-trust-badge">↩️ 30 días devolución</span>
                    <span class="pd-trust-badge">🛡️ Garantía 2 años</span>
                </div>

                <!-- Seller -->
                <div class="pd-seller-block">
                    <div class="pd-seller-title">Vendedor</div>
                    <div class="pd-seller-info">
                        <div class="pd-seller-avatar">${p.vendedor.nombre[0]}</div>
                        <div>
                            <div class="pd-seller-name">${p.vendedor.nombre}</div>
                            <div class="pd-seller-rating">⭐ ${p.vendedor.rating} · ${p.vendedor.ventas.toLocaleString()} ventas</div>
                        </div>
                    </div>
                    <div class="pd-seller-stats">
                        <span class="pd-seller-stat">⚡ Responde en ${p.vendedor.respuesta}</span>
                        <span class="pd-seller-stat">📦 Envía en ${p.diasEntrega} días</span>
                    </div>
                </div>

                <!-- Payment -->
                <div class="pd-payment">
                    <div class="pd-payment-title">Formas de pago</div>
                    <div class="pd-payment-methods">
                        <span class="pd-payment-method">💳 Visa</span>
                        <span class="pd-payment-method">💳 Mastercard</span>
                        <span class="pd-payment-method">💳 Amex</span>
                        <span class="pd-payment-method">🟡 MercadoPago</span>
                        <span class="pd-payment-method">🏦 Transferencia</span>
                        <span class="pd-payment-method">📅 Cuotas sin interés</span>
                    </div>
                </div>
            </div>
        `;

        this.setupDetailListeners();
        this.updateStockDisplay();
    }

    renderSizeSelector() {
        const p = this.producto;
        if (!p.talles || p.talles.length === 0) return '';
        const stockObj = p.stock || {};
        return `
            <div class="pd-variant-group">
                <div class="pd-variant-label">Talle: <span id="pdSelectedSize">${this.selectedSize || 'Seleccioná un talle'}</span></div>
                <div class="pd-size-options">
                    ${p.talles.map(t => {
                        const stockCount = stockObj[t] !== undefined ? stockObj[t] : 99;
                        const oos = stockCount === 0;
                        const isActive = this.selectedSize === t;
                        return `<button class="pd-size-btn ${isActive ? 'active' : ''} ${oos ? 'out-of-stock' : ''}"
                            data-size="${t}" ${oos ? 'disabled' : ''}>${t}</button>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderColorSelector() {
        const p = this.producto;
        if (!p.colores || p.colores.length === 0) return '';
        return `
            <div class="pd-variant-group">
                <div class="pd-variant-label">Color: <span id="pdSelectedColor">${this.selectedColor ? this.selectedColor.nombre : 'Seleccioná un color'}</span></div>
                <div class="pd-color-options">
                    ${p.colores.map((c, i) => `
                        <button class="pd-color-btn ${i === 0 ? 'active' : ''}" data-color-idx="${i}">
                            <span class="pd-color-dot" style="background:${c.hex}"></span>
                            ${c.nombre}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);
        return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
    }

    formatPrice(val) {
        return '$' + Number(val).toLocaleString('es-AR');
    }

    getStockStatus() {
        const p = this.producto;
        const stockObj = p.stock || {};
        const totalStock = this.selectedSize
            ? (stockObj[this.selectedSize] || 0)
            : Object.values(stockObj).reduce((a, b) => a + b, 0);

        if (totalStock === 0) return { cls: 'out-of-stock', label: 'Sin stock' };
        if (totalStock <= 3) return { cls: 'low-stock', label: `¡Últimas ${totalStock}!` };
        return { cls: 'in-stock', label: 'En stock' };
    }

    updateStockDisplay() {
        const p = this.producto;
        const stockObj = p.stock || {};
        const stockEl = document.getElementById('pdQtyStock');
        if (!stockEl) return;

        if (this.selectedSize) {
            const s = stockObj[this.selectedSize] || 0;
            stockEl.textContent = s > 0 ? `${s} disponibles en talle ${this.selectedSize}` : 'Sin stock en este talle';
            stockEl.style.color = s > 0 ? '#388e3c' : '#d32f2f';
        } else {
            stockEl.textContent = 'Seleccioná un talle para ver disponibilidad';
            stockEl.style.color = '#666';
        }
    }

    setupDetailListeners() {
        // Thumbnails
        document.querySelectorAll('.pd-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const idx = parseInt(thumb.dataset.index);
                this.goToImage(idx);
            });
        });

        // Nav arrows
        const prevBtn = document.getElementById('pdGalleryPrev');
        const nextBtn = document.getElementById('pdGalleryNext');
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevImage());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextImage());

        // Zoom / open gallery modal
        const zoomBtn = document.getElementById('pdZoomBtn');
        if (zoomBtn) zoomBtn.addEventListener('click', () => this.openGalleryModal());

        // Main image zoom on hover
        const mainGallery = document.getElementById('pdGalleryMain');
        if (mainGallery) {
            mainGallery.addEventListener('mousemove', (e) => {
                const rect = mainGallery.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                mainGallery.style.setProperty('--zoom-x', x + '%');
                mainGallery.style.setProperty('--zoom-y', y + '%');
            });
        }

        // Size buttons
        document.querySelectorAll('.pd-size-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedSize = btn.dataset.size;
                const label = document.getElementById('pdSelectedSize');
                if (label) label.textContent = this.selectedSize;
                this.updateStockDisplay();
                this.updateStockBadge();
            });
        });

        // Color buttons
        document.querySelectorAll('.pd-color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pd-color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const idx = parseInt(btn.dataset.colorIdx);
                this.selectedColor = this.producto.colores[idx];
                const label = document.getElementById('pdSelectedColor');
                if (label) label.textContent = this.selectedColor.nombre;
            });
        });

        // Quantity controls
        const minusBtn = document.getElementById('pdQtyMinus');
        const plusBtn = document.getElementById('pdQtyPlus');
        const qtyInput = document.getElementById('pdQtyInput');

        if (minusBtn) minusBtn.addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                if (qtyInput) qtyInput.value = this.quantity;
            }
        });

        if (plusBtn) plusBtn.addEventListener('click', () => {
            if (this.quantity < 10) {
                this.quantity++;
                if (qtyInput) qtyInput.value = this.quantity;
            }
        });

        if (qtyInput) {
            qtyInput.addEventListener('change', () => {
                const val = parseInt(qtyInput.value);
                if (val >= 1 && val <= 10) {
                    this.quantity = val;
                } else {
                    qtyInput.value = this.quantity;
                }
            });
        }

        // Add to cart
        const cartBtn = document.getElementById('pdBtnCart');
        if (cartBtn) cartBtn.addEventListener('click', () => this.addToCart());

        // Buy now
        const buyBtn = document.getElementById('pdBtnBuy');
        if (buyBtn) buyBtn.addEventListener('click', () => {
            this.addToCart();
            window.location.href = 'checkout.html';
        });

        // Favorite buttons
        const favBtn = document.getElementById('pdBtnFav');
        const favBtnGallery = document.getElementById('pdFavBtn');
        [favBtn, favBtnGallery].forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.handleFavorite());
        });

        // Share buttons
        const shareBtn = document.getElementById('pdBtnShare');
        const shareBtnGallery = document.getElementById('pdShareBtn');
        [shareBtn, shareBtnGallery].forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.openShareModal());
        });
    }

    addToCart() {
        if (!this.selectedSize && this.producto.talles && this.producto.talles.length > 1) {
            if (typeof NotificacionesComponent !== 'undefined') {
                NotificacionesComponent.mostrar('Por favor, seleccioná un talle', 'warning');
            }
            return;
        }

        const productForCart = {
            ...this.producto,
            precio: this.producto.precio,
            talle: this.selectedSize || (this.producto.talles && this.producto.talles[0]),
            color: this.selectedColor ? this.selectedColor.nombre : null
        };

        if (typeof carritoService !== 'undefined') {
            carritoService.agregarProducto(productForCart, this.quantity);
        }
        if (typeof NotificacionesComponent !== 'undefined') {
            NotificacionesComponent.mostrar('✅ Producto agregado al carrito', 'success');
        }
    }

    handleFavorite() {
        this.toggleFavorite();
        const favBtn = document.getElementById('pdBtnFav');
        const favBtnGallery = document.getElementById('pdFavBtn');
        if (favBtn) {
            favBtn.classList.toggle('active', this.isFavorite);
            favBtn.textContent = this.isFavorite ? '❤️ En favoritos' : '🤍 Agregar a favoritos';
        }
        if (favBtnGallery) favBtnGallery.textContent = this.isFavorite ? '❤️' : '🤍';
        if (typeof NotificacionesComponent !== 'undefined') {
            NotificacionesComponent.mostrar(
                this.isFavorite ? '❤️ Guardado en favoritos' : 'Eliminado de favoritos',
                'info'
            );
        }
    }

    openShareModal() {
        const modal = document.getElementById('shareModal');
        if (!modal) return;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.producto.nombre + ' - Cota 480');

        const whatsappBtn = document.getElementById('shareWhatsapp');
        if (whatsappBtn) whatsappBtn.href = `https://wa.me/?text=${title}%20${url}`;

        const fbBtn = document.getElementById('shareFacebook');
        if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

        const twBtn = document.getElementById('shareTwitter');
        if (twBtn) twBtn.href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;

        const copyBtn = document.getElementById('shareCopy');
        if (copyBtn) copyBtn.onclick = () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                copyBtn.textContent = '✅ Enlace copiado!';
                setTimeout(() => { copyBtn.textContent = '📋 Copiar enlace'; }, 2000);
            });
        };

        const closeBtn = document.getElementById('shareModalClose');
        if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; };
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

        modal.style.display = 'flex';
    }

    updateStockBadge() {
        const status = this.getStockStatus();
        const badge = document.querySelector('.pd-stock-badge');
        if (badge) {
            badge.className = `pd-stock-badge ${status.cls}`;
            badge.textContent = status.label;
        }
    }

    goToImage(index) {
        const imagenes = this.producto.imagenes || [this.producto.imagen];
        this.currentImageIndex = Math.max(0, Math.min(index, imagenes.length - 1));
        const mainImg = document.getElementById('pdMainImg');
        if (mainImg) mainImg.src = imagenes[this.currentImageIndex];
        const indicator = document.getElementById('pdGalleryIndicator');
        if (indicator) indicator.textContent = `${this.currentImageIndex + 1} / ${imagenes.length}`;
        document.querySelectorAll('.pd-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === this.currentImageIndex);
        });
    }

    prevImage() {
        const imagenes = this.producto.imagenes || [this.producto.imagen];
        const newIdx = (this.currentImageIndex - 1 + imagenes.length) % imagenes.length;
        this.goToImage(newIdx);
    }

    nextImage() {
        const imagenes = this.producto.imagenes || [this.producto.imagen];
        const newIdx = (this.currentImageIndex + 1) % imagenes.length;
        this.goToImage(newIdx);
    }

    openGalleryModal() {
        const modal = document.getElementById('galleryModal');
        if (!modal) return;
        modal.style.display = 'flex';
        this.updateGalleryModal();

        document.getElementById('galleryModalClose').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('galleryModalPrev').onclick = () => {
            const imagenes = this.producto.imagenes || [this.producto.imagen];
            this.currentImageIndex = (this.currentImageIndex - 1 + imagenes.length) % imagenes.length;
            this.updateGalleryModal();
        };
        document.getElementById('galleryModalNext').onclick = () => {
            const imagenes = this.producto.imagenes || [this.producto.imagen];
            this.currentImageIndex = (this.currentImageIndex + 1) % imagenes.length;
            this.updateGalleryModal();
        };
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

        // Keyboard navigation
        document.onkeydown = (e) => {
            if (modal.style.display !== 'none') {
                if (e.key === 'ArrowLeft') document.getElementById('galleryModalPrev').click();
                if (e.key === 'ArrowRight') document.getElementById('galleryModalNext').click();
                if (e.key === 'Escape') modal.style.display = 'none';
            }
        };
    }

    updateGalleryModal() {
        const imagenes = this.producto.imagenes || [this.producto.imagen];
        const img = document.getElementById('galleryModalImg');
        if (img) {
            img.src = imagenes[this.currentImageIndex];
            img.alt = `${this.producto.nombre} - imagen ${this.currentImageIndex + 1}`;
        }
        const dotsEl = document.getElementById('galleryModalDots');
        if (dotsEl) {
            dotsEl.innerHTML = imagenes.map((_, i) =>
                `<span class="gallery-modal-dot ${i === this.currentImageIndex ? 'active' : ''}" data-idx="${i}"></span>`
            ).join('');
            dotsEl.querySelectorAll('.gallery-modal-dot').forEach(dot => {
                dot.onclick = () => {
                    this.currentImageIndex = parseInt(dot.dataset.idx);
                    this.updateGalleryModal();
                };
            });
        }
    }

    renderTabs() {
        const p = this.producto;
        const section = document.getElementById('productTabsSection');
        if (!section || !p) return;
        section.style.display = 'block';

        // Description
        const descEl = document.getElementById('tab-description');
        if (descEl) {
            descEl.innerHTML = `
                <p class="pd-description-long">${p.descripcionLarga || p.descripcion}</p>
                ${p.caracteristicas && p.caracteristicas.length ? `
                    <h3 style="margin-bottom:12px;color:#1a3a47;font-size:16px;">Características principales</h3>
                    <ul class="pd-features-list">
                        ${p.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                ` : ''}
            `;
        }

        // Specs
        const specsEl = document.getElementById('tab-specs');
        if (specsEl && p.especificaciones) {
            specsEl.innerHTML = `
                <table class="pd-specs-table">
                    <tbody>
                        ${Object.entries(p.especificaciones).map(([key, val]) =>
                            `<tr><td>${key}</td><td>${val}</td></tr>`
                        ).join('')}
                    </tbody>
                </table>
            `;
        }

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById('tab-' + btn.dataset.tab);
                if (panel) panel.classList.add('active');
            });
        });
    }

    renderReviews() {
        const p = this.producto;
        const section = document.getElementById('productReviewsSection');
        const container = document.getElementById('reviewsContent');
        if (!section || !container || !p.reviews || p.reviews.length === 0) return;
        section.style.display = 'block';

        const reviews = p.reviews;
        const total = reviews.length;
        const avg = p.rating;

        // Distribution
        const dist = [5, 4, 3, 2, 1].map(star => ({
            star,
            count: reviews.filter(r => Math.round(r.rating) === star).length
        }));

        container.innerHTML = `
            <div class="pd-reviews-summary">
                <div class="pd-reviews-average">
                    <div class="pd-avg-score">${avg}</div>
                    <div class="pd-avg-stars">${this.renderStars(avg)}</div>
                    <div class="pd-avg-count">${p.totalReviews} reseñas</div>
                </div>
                <div class="pd-reviews-distribution">
                    ${dist.map(d => `
                        <div class="pd-dist-row" data-star="${d.star}">
                            <span class="pd-dist-label">${d.star}★</span>
                            <div class="pd-dist-bar-wrap">
                                <div class="pd-dist-bar" style="width:${total > 0 ? Math.round((d.count/total)*100) : 0}%"></div>
                            </div>
                            <span class="pd-dist-count">${d.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="pd-reviews-filter">
                <button class="pd-review-filter-btn active" data-filter="">Todos</button>
                <button class="pd-review-filter-btn" data-filter="5">5 ⭐</button>
                <button class="pd-review-filter-btn" data-filter="4">4 ⭐</button>
                <button class="pd-review-filter-btn" data-filter="3">3 ⭐</button>
            </div>
            <div class="pd-review-list" id="pdReviewList">
                ${this.renderReviewCards(reviews)}
            </div>
        `;

        // Filter buttons
        document.querySelectorAll('.pd-review-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pd-review-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const filtered = filter
                    ? reviews.filter(r => Math.round(r.rating) === parseInt(filter))
                    : reviews;
                const list = document.getElementById('pdReviewList');
                if (list) list.innerHTML = this.renderReviewCards(filtered);
            });
        });
    }

    renderReviewCards(reviews) {
        return reviews.map(r => `
            <div class="pd-review-card">
                <div class="pd-review-avatar">${r.avatar || r.usuario[0]}</div>
                <div class="pd-review-body">
                    <div class="pd-review-header">
                        <span class="pd-review-user">${r.usuario}</span>
                        <span class="pd-review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
                        <span class="pd-review-date">${r.fecha}</span>
                    </div>
                    <p class="pd-review-text">${r.comentario}</p>
                </div>
            </div>
        `).join('');
    }

    renderRelated() {
        const p = this.producto;
        const section = document.getElementById('relatedProductsSection');
        const carousel = document.getElementById('relatedCarousel');
        if (!section || !carousel || !p.relacionados) return;

        const related = p.relacionados
            .map(id => productosService.obtenerPorId(id))
            .filter(Boolean);

        if (related.length === 0) return;
        section.style.display = 'block';

        carousel.innerHTML = related.map(prod => `
            <a href="product-detail.html?id=${prod.id}" class="related-card">
                <div class="related-card-img">
                    <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
                </div>
                <div class="related-card-info">
                    <div class="related-card-name">${prod.nombre}</div>
                    <div class="related-card-price">$${Number(prod.precio).toLocaleString('es-AR')}</div>
                    <div class="related-card-rating">${'★'.repeat(Math.floor(prod.rating))} ${prod.rating}</div>
                </div>
            </a>
        `).join('');
    }

    renderFAQs() {
        const p = this.producto;
        const section = document.getElementById('productFaqSection');
        const container = document.getElementById('faqContent');
        if (!section || !container || !p.faqs || p.faqs.length === 0) return;
        section.style.display = 'block';

        container.innerHTML = p.faqs.map((faq, i) => `
            <div class="faq-item" id="faq-${i}">
                <div class="faq-question">${faq.pregunta}</div>
                <div class="faq-answer">
                    <div class="faq-answer-inner">${faq.respuesta}</div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.faq-item').forEach(item => {
            item.querySelector('.faq-question').addEventListener('click', () => {
                item.classList.toggle('open');
            });
        });
    }

    renderError(msg) {
        const container = document.getElementById('productDetailContent');
        if (container) {
            container.innerHTML = `
                <div class="pd-loading" style="grid-column:1/-1">
                    <div style="font-size:48px">😕</div>
                    <h3>${msg}</h3>
                    <a href="../index.html" style="color:#1a3a47;font-weight:700;text-decoration:underline">Volver al inicio</a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ProductDetailComponent());
} else {
    new ProductDetailComponent();
}
