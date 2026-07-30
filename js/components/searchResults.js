/**
 * COMPONENTE: RESULTADOS DE BÚSQUEDA
 * Gestiona la página de búsqueda con filtros y paginación
 */

class SearchResultsComponent {
    constructor() {
        this.allProducts = productosService.obtenerTodos();
        this.filteredProducts = [...this.allProducts];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentView = 'grid';
        this.sortBy = 'relevance';
        this.searchQuery = '';
        this.filters = {
            categories: [],
            brands: [],
            minPrice: 0,
            maxPrice: Infinity,
            rating: 0,
            freeShipping: false,
            storePickup: false,
            hasDiscount: false
        };
        this.init();
    }

    init() {
        this.readURLParams();
        this.applyFiltersAndRender();
        this.setupListeners();
        this.renderRecentlyViewed();
        this.updateSearchInput();
        this.updatePageTitle();
    }

    readURLParams() {
        const params = new URLSearchParams(window.location.search);
        this.searchQuery = params.get('q') || params.get('query') || '';
        const cat = params.get('category');
        if (cat) this.filters.categories = [cat];

        const minP = params.get('minPrice');
        const maxP = params.get('maxPrice');
        if (minP) this.filters.minPrice = parseInt(minP);
        if (maxP) this.filters.maxPrice = parseInt(maxP);

        const sort = params.get('sort');
        if (sort) this.sortBy = sort;
    }

    updateSearchInput() {
        const input = document.getElementById('srSearchInput');
        if (input) input.value = this.searchQuery;

        // Update checkboxes for pre-set categories
        this.filters.categories.forEach(cat => {
            const checkbox = document.querySelector(`input[name="category"][value="${cat}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // Price inputs
        const minInput = document.getElementById('priceMin');
        const maxInput = document.getElementById('priceMax');
        if (minInput && this.filters.minPrice > 0) minInput.value = this.filters.minPrice;
        if (maxInput && this.filters.maxPrice < Infinity) maxInput.value = this.filters.maxPrice;
    }

    updatePageTitle() {
        const titleEl = document.getElementById('srResultsTitle');
        const countEl = document.getElementById('srResultsCount');
        const pageTitle = document.getElementById('pageTitle');

        if (this.searchQuery) {
            if (titleEl) titleEl.textContent = `Resultados para: "${this.searchQuery}"`;
            if (pageTitle) document.title = `"${this.searchQuery}" - Cota 480`;
        } else if (this.filters.categories.length === 1) {
            const cat = this.filters.categories[0];
            const label = cat.charAt(0).toUpperCase() + cat.slice(1);
            if (titleEl) titleEl.textContent = label;
            if (pageTitle) document.title = `${label} - Cota 480`;
        } else {
            if (titleEl) titleEl.textContent = 'Catálogo de productos';
            if (pageTitle) document.title = 'Búsqueda - Cota 480';
        }

        const totalOnPage = Math.min(
            this.itemsPerPage,
            this.filteredProducts.length - (this.currentPage - 1) * this.itemsPerPage
        );
        if (countEl) {
            countEl.textContent = `${this.filteredProducts.length} producto${this.filteredProducts.length !== 1 ? 's' : ''} encontrado${this.filteredProducts.length !== 1 ? 's' : ''}`;
        }
    }

    applyFiltersAndRender() {
        this.filteredProducts = this.filterProducts(this.allProducts);
        this.filteredProducts = this.sortProducts(this.filteredProducts);
        this.currentPage = 1;
        this.renderProducts();
        this.renderPagination();
        this.renderActiveFilters();
        this.updatePageTitle();
    }

    filterProducts(products) {
        return products.filter(p => {
            // Search query
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                const match = (p.nombre || '').toLowerCase().includes(q) ||
                    (p.descripcion || '').toLowerCase().includes(q) ||
                    (p.categoria || '').toLowerCase().includes(q) ||
                    (p.marca || '').toLowerCase().includes(q) ||
                    (p.descripcionLarga || '').toLowerCase().includes(q);
                if (!match) return false;
            }

            // Categories
            if (this.filters.categories.length > 0) {
                if (!this.filters.categories.includes(p.categoria)) return false;
            }

            // Brands
            if (this.filters.brands.length > 0) {
                if (!this.filters.brands.includes(p.marca)) return false;
            }

            // Price
            if (p.precio < this.filters.minPrice) return false;
            if (this.filters.maxPrice < Infinity && p.precio > this.filters.maxPrice) return false;

            // Rating
            if (this.filters.rating > 0 && (p.rating || 0) < this.filters.rating) return false;

            // Free shipping
            if (this.filters.freeShipping && p.envio !== 'Gratis') return false;

            // Discount
            if (this.filters.hasDiscount && !p.descuento) return false;

            return true;
        });
    }

    sortProducts(products) {
        const sorted = [...products];
        switch (this.sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.precio - b.precio);
            case 'price-desc':
                return sorted.sort((a, b) => b.precio - a.precio);
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'discount':
                return sorted.sort((a, b) => (b.descuento || 0) - (a.descuento || 0));
            case 'newest':
                return sorted.sort((a, b) => b.id - a.id);
            default:
                return sorted;
        }
    }

    getPageProducts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredProducts.slice(start, start + this.itemsPerPage);
    }

    renderProducts() {
        const grid = document.getElementById('srResultsGrid');
        const empty = document.getElementById('srEmpty');
        if (!grid) return;

        const products = this.getPageProducts();

        if (products.length === 0) {
            grid.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';

        const favorites = this.getFavorites();

        grid.innerHTML = products.map(p => this.renderCard(p, favorites)).join('');
        grid.className = `sr-results-grid${this.currentView === 'list' ? ' list-view' : ''}`;

        // Card click → product detail
        grid.querySelectorAll('.sr-product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.sr-card-fav-btn') || e.target.closest('.sr-card-hover-btn') || e.target.closest('.sr-card-view-btn')) return;
                const id = card.dataset.id;
                window.location.href = `product-detail.html?id=${id}`;
            });
        });

        // "Ver detalle" buttons
        grid.querySelectorAll('.sr-card-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.closest('[data-id]').dataset.id;
                window.location.href = `product-detail.html?id=${id}`;
            });
        });

        // Favorite buttons
        grid.querySelectorAll('.sr-card-fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.toggleFavorite(id, btn);
            });
        });

        // Add to cart (hover button)
        grid.querySelectorAll('.sr-card-hover-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const product = productosService.obtenerPorId(id);
                if (product && typeof carritoService !== 'undefined') {
                    carritoService.agregarProducto(product, 1);
                    if (typeof NotificacionesComponent !== 'undefined') {
                        NotificacionesComponent.mostrar('✅ Producto agregado al carrito', 'success');
                    }
                }
            });
        });
    }

    renderCard(p, favorites) {
        const isFav = favorites.includes(p.id);
        const stars = '★'.repeat(Math.floor(p.rating || 0)) + '☆'.repeat(5 - Math.floor(p.rating || 0));
        const priceFormatted = '$' + Number(p.precio).toLocaleString('es-AR');
        const originalFormatted = p.precioOriginal ? '$' + Number(p.precioOriginal).toLocaleString('es-AR') : '';

        return `
            <div class="sr-product-card" data-id="${p.id}" style="cursor:pointer">
                <div class="sr-card-img-wrap">
                    ${p.descuento ? `<div class="sr-card-discount-badge">-${p.descuento}%</div>` : ''}
                    <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
                    <button class="sr-card-hover-btn" data-id="${p.id}">🛒 Agregar al carrito</button>
                    <button class="sr-card-fav-btn ${isFav ? 'active' : ''}" data-id="${p.id}" aria-label="Favorito">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
                <div class="sr-card-body">
                    <div class="sr-card-category">${(p.categoria || '').toUpperCase()}</div>
                    <div class="sr-card-name">${p.nombre}</div>
                    <div class="sr-card-rating">
                        <span class="sr-card-stars">${stars}</span>
                        <span class="sr-card-review-count">(${p.totalReviews || 0})</span>
                    </div>
                    <div class="sr-card-price-row">
                        <span class="sr-card-price">${priceFormatted}</span>
                        ${originalFormatted ? `<span class="sr-card-original-price">${originalFormatted}</span>` : ''}
                    </div>
                    ${p.envio === 'Gratis' ? '<div class="sr-card-free-shipping">🚚 Envío gratis</div>' : ''}
                    <a class="sr-card-view-btn" href="product-detail.html?id=${p.id}">Ver detalle</a>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const pag = document.getElementById('srPagination');
        if (!pag) return;

        const total = this.filteredProducts.length;
        const totalPages = Math.ceil(total / this.itemsPerPage);

        if (totalPages <= 1) {
            pag.style.display = 'none';
            return;
        }

        pag.style.display = 'flex';

        const prevBtn = document.getElementById('srPrevPage');
        const nextBtn = document.getElementById('srNextPage');
        const numbersEl = document.getElementById('srPageNumbers');

        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;

        if (numbersEl) {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || Math.abs(i - this.currentPage) <= 1) {
                    pages.push(i);
                } else if (pages[pages.length - 1] !== '...') {
                    pages.push('...');
                }
            }
            numbersEl.innerHTML = pages.map(p =>
                p === '...'
                    ? `<span style="padding:0 4px;color:#aaa;align-self:center">…</span>`
                    : `<button class="sr-page-num ${p === this.currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`
            ).join('');

            numbersEl.querySelectorAll('.sr-page-num').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.currentPage = parseInt(btn.dataset.page);
                    this.renderProducts();
                    this.renderPagination();
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                });
            });
        }
    }

    renderActiveFilters() {
        const container = document.getElementById('srActiveFilters');
        const tagsEl = document.getElementById('srFilterTags');
        const countEl = document.getElementById('srActiveFilterCount');
        if (!container || !tagsEl) return;

        const tags = [];

        if (this.searchQuery) tags.push({ label: `"${this.searchQuery}"`, key: 'query' });
        this.filters.categories.forEach(c => tags.push({ label: c, key: 'category', val: c }));
        this.filters.brands.forEach(b => tags.push({ label: b, key: 'brand', val: b }));
        if (this.filters.minPrice > 0) tags.push({ label: `Desde $${this.filters.minPrice.toLocaleString('es-AR')}`, key: 'minPrice' });
        if (this.filters.maxPrice < Infinity) tags.push({ label: `Hasta $${this.filters.maxPrice.toLocaleString('es-AR')}`, key: 'maxPrice' });
        if (this.filters.rating > 0) tags.push({ label: `${this.filters.rating}★+`, key: 'rating' });
        if (this.filters.freeShipping) tags.push({ label: 'Envío gratis', key: 'freeShipping' });
        if (this.filters.hasDiscount) tags.push({ label: 'Con descuento', key: 'hasDiscount' });

        if (tags.length === 0) {
            container.style.display = 'none';
            if (countEl) countEl.textContent = '';
            return;
        }

        container.style.display = 'flex';
        if (countEl) countEl.textContent = `(${tags.length})`;

        tagsEl.innerHTML = tags.map(tag => `
            <span class="sr-filter-tag" data-key="${tag.key}" data-val="${tag.val || ''}">
                ${tag.label}
                <button class="sr-filter-tag-remove" data-key="${tag.key}" data-val="${tag.val || ''}">✕</button>
            </span>
        `).join('');

        tagsEl.querySelectorAll('.sr-filter-tag-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFilter(btn.dataset.key, btn.dataset.val);
            });
        });
    }

    removeFilter(key, val) {
        switch (key) {
            case 'query':
                this.searchQuery = '';
                const inp = document.getElementById('srSearchInput');
                if (inp) inp.value = '';
                break;
            case 'category':
                this.filters.categories = this.filters.categories.filter(c => c !== val);
                const cb = document.querySelector(`input[name="category"][value="${val}"]`);
                if (cb) cb.checked = false;
                break;
            case 'brand':
                this.filters.brands = this.filters.brands.filter(b => b !== val);
                const bb = document.querySelector(`input[name="brand"][value="${val}"]`);
                if (bb) bb.checked = false;
                break;
            case 'minPrice':
                this.filters.minPrice = 0;
                const minInp = document.getElementById('priceMin');
                if (minInp) minInp.value = '';
                const rangeMin = document.getElementById('rangeMin');
                if (rangeMin) rangeMin.value = 0;
                break;
            case 'maxPrice':
                this.filters.maxPrice = Infinity;
                const maxInp = document.getElementById('priceMax');
                if (maxInp) maxInp.value = '';
                const rangeMax = document.getElementById('rangeMax');
                if (rangeMax) rangeMax.value = 500000;
                break;
            case 'rating':
                this.filters.rating = 0;
                const rb = document.querySelector('input[name="rating"]:last-child');
                if (rb) rb.checked = true;
                break;
            case 'freeShipping':
                this.filters.freeShipping = false;
                const fsCb = document.querySelector('input[name="shipping"][value="free"]');
                if (fsCb) fsCb.checked = false;
                break;
            case 'hasDiscount':
                this.filters.hasDiscount = false;
                const discCb = document.querySelector('input[name="discount"][value="1"]');
                if (discCb) discCb.checked = false;
                break;
        }
        this.applyFiltersAndRender();
        this.updateURL();
    }

    clearAllFilters() {
        this.searchQuery = '';
        this.filters = {
            categories: [], brands: [],
            minPrice: 0, maxPrice: Infinity,
            rating: 0, freeShipping: false,
            storePickup: false, hasDiscount: false
        };

        // Reset UI
        document.querySelectorAll('.sr-filter-body input').forEach(inp => {
            if (inp.type === 'checkbox') inp.checked = false;
            if (inp.type === 'radio' && inp.value === '') inp.checked = true;
            if (inp.type === 'number') inp.value = '';
        });
        const rangeMin = document.getElementById('rangeMin');
        const rangeMax = document.getElementById('rangeMax');
        if (rangeMin) rangeMin.value = 0;
        if (rangeMax) rangeMax.value = 500000;
        this.updateRangeFill();

        const searchInput = document.getElementById('srSearchInput');
        if (searchInput) searchInput.value = '';

        this.applyFiltersAndRender();
        this.updateURL();
    }

    setupListeners() {
        // Search form
        const form = document.getElementById('srSearchForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = document.getElementById('srSearchInput').value.trim();
                this.searchQuery = val;
                this.saveSearchHistory(val);
                this.hideAutocomplete();
                this.applyFiltersAndRender();
                this.updateURL();
            });
        }

        // Search autocomplete
        const searchInput = document.getElementById('srSearchInput');
        if (searchInput) {
            const debouncedAC = debounce((val) => this.showAutocomplete(val), 250);
            searchInput.addEventListener('input', (e) => debouncedAC(e.target.value));
            searchInput.addEventListener('blur', () => setTimeout(() => this.hideAutocomplete(), 200));
            searchInput.addEventListener('focus', (e) => { if (e.target.value) this.showAutocomplete(e.target.value); });
        }

        // Trending tags
        document.querySelectorAll('.sr-trending-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const q = tag.dataset.q;
                const inp = document.getElementById('srSearchInput');
                if (inp) inp.value = q;
                this.searchQuery = q;
                this.applyFiltersAndRender();
                this.updateURL();
            });
        });

        // Category checkboxes
        document.querySelectorAll('input[name="category"]').forEach(cb => {
            cb.addEventListener('change', () => {
                this.filters.categories = Array.from(
                    document.querySelectorAll('input[name="category"]:checked')
                ).map(el => el.value);
                this.applyFiltersAndRender();
                this.updateURL();
            });
        });

        // Brand checkboxes
        document.querySelectorAll('input[name="brand"]').forEach(cb => {
            cb.addEventListener('change', () => {
                this.filters.brands = Array.from(
                    document.querySelectorAll('input[name="brand"]:checked')
                ).map(el => el.value);
                this.applyFiltersAndRender();
                this.updateURL();
            });
        });

        // Rating radio
        document.querySelectorAll('input[name="rating"]').forEach(rb => {
            rb.addEventListener('change', () => {
                this.filters.rating = rb.value ? parseFloat(rb.value) : 0;
                this.applyFiltersAndRender();
            });
        });

        // Shipping checkboxes
        const freeCb = document.querySelector('input[name="shipping"][value="free"]');
        if (freeCb) freeCb.addEventListener('change', () => {
            this.filters.freeShipping = freeCb.checked;
            this.applyFiltersAndRender();
        });

        const pickupCb = document.querySelector('input[name="shipping"][value="pickup"]');
        if (pickupCb) pickupCb.addEventListener('change', () => {
            this.filters.storePickup = pickupCb.checked;
            this.applyFiltersAndRender();
        });

        // Discount checkbox
        const discCb = document.querySelector('input[name="discount"][value="1"]');
        if (discCb) discCb.addEventListener('change', () => {
            this.filters.hasDiscount = discCb.checked;
            this.applyFiltersAndRender();
        });

        // Price apply button
        const applyPrice = document.getElementById('srApplyPrice');
        if (applyPrice) applyPrice.addEventListener('click', () => {
            const minVal = parseInt(document.getElementById('priceMin').value) || 0;
            const maxVal = parseInt(document.getElementById('priceMax').value) || 0;
            this.filters.minPrice = minVal;
            this.filters.maxPrice = maxVal > 0 ? maxVal : Infinity;
            this.applyFiltersAndRender();
            this.updateURL();
        });

        // Price range slider
        this.setupPriceSlider();

        // Sort
        const sortSelect = document.getElementById('srSortSelect');
        if (sortSelect) {
            sortSelect.value = this.sortBy;
            sortSelect.addEventListener('change', () => {
                this.sortBy = sortSelect.value;
                this.applyFiltersAndRender();
                this.updateURL();
            });
        }

        // View toggle
        const viewGrid = document.getElementById('viewGrid');
        const viewList = document.getElementById('viewList');
        if (viewGrid) viewGrid.addEventListener('click', () => {
            this.currentView = 'grid';
            viewGrid.classList.add('active');
            if (viewList) viewList.classList.remove('active');
            this.renderProducts();
        });
        if (viewList) viewList.addEventListener('click', () => {
            this.currentView = 'list';
            viewList.classList.add('active');
            if (viewGrid) viewGrid.classList.remove('active');
            this.renderProducts();
        });

        // Clear filters
        const clearBtn = document.getElementById('srClearFilters');
        const clearAllBtn = document.getElementById('srClearAll');
        [clearBtn, clearAllBtn].forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.clearAllFilters());
        });

        // Pagination
        const prevBtn = document.getElementById('srPrevPage');
        const nextBtn = document.getElementById('srNextPage');
        if (prevBtn) prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderProducts();
                this.renderPagination();
                window.scrollTo({ top: 200, behavior: 'smooth' });
            }
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderProducts();
                this.renderPagination();
                window.scrollTo({ top: 200, behavior: 'smooth' });
            }
        });

        // Filter group collapsible
        document.querySelectorAll('.sr-filter-title').forEach(title => {
            title.addEventListener('click', () => {
                const group = title.closest('.sr-filter-group');
                if (group) group.classList.toggle('collapsed');
            });
        });

        // Mobile filter toggle
        const mobileToggle = document.getElementById('srMobileFilterToggle');
        const sidebar = document.getElementById('srSidebar');
        if (mobileToggle && sidebar) {
            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'sr-sidebar-backdrop';
            document.body.appendChild(backdrop);

            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                backdrop.classList.toggle('visible');
            });

            backdrop.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                backdrop.classList.remove('visible');
            });
        }
    }

    setupPriceSlider() {
        const rangeMin = document.getElementById('rangeMin');
        const rangeMax = document.getElementById('rangeMax');
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');

        if (!rangeMin || !rangeMax) return;

        const updateFill = () => {
            const min = parseInt(rangeMin.value);
            const max = parseInt(rangeMax.value);
            const total = parseInt(rangeMax.max);
            const leftPct = (min / total) * 100;
            const rightPct = 100 - (max / total) * 100;
            const fill = document.getElementById('priceRangeFill');
            if (fill) {
                fill.style.left = leftPct + '%';
                fill.style.right = rightPct + '%';
            }
        };

        rangeMin.addEventListener('input', () => {
            if (parseInt(rangeMin.value) > parseInt(rangeMax.value) - 5000) {
                rangeMin.value = parseInt(rangeMax.value) - 5000;
            }
            if (priceMin) priceMin.value = rangeMin.value;
            updateFill();
        });

        rangeMax.addEventListener('input', () => {
            if (parseInt(rangeMax.value) < parseInt(rangeMin.value) + 5000) {
                rangeMax.value = parseInt(rangeMin.value) + 5000;
            }
            if (priceMax) priceMax.value = rangeMax.value;
            updateFill();
        });

        // Sync number inputs → range
        if (priceMin) priceMin.addEventListener('input', () => {
            const val = parseInt(priceMin.value) || 0;
            rangeMin.value = val;
            updateFill();
        });

        if (priceMax) priceMax.addEventListener('input', () => {
            const val = parseInt(priceMax.value) || 500000;
            rangeMax.value = Math.min(val, 500000);
            updateFill();
        });

        updateFill();
        this.updateRangeFill = updateFill;
    }

    updateRangeFill() {
        // Fallback no-op; overwritten in setupPriceSlider
    }

    showAutocomplete(query) {
        const container = document.getElementById('srAutocomplete');
        if (!container) return;
        if (!query || query.length < 2) {
            container.style.display = 'none';
            return;
        }

        const results = productosService.buscar(query).slice(0, 6);
        const history = this.getSearchHistory().filter(h => h.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

        if (results.length === 0 && history.length === 0) {
            container.style.display = 'none';
            return;
        }

        const historyHTML = history.map(h => `
            <div class="sr-autocomplete-item" data-q="${h}">
                <span class="sr-autocomplete-icon">🕐</span>${h}
            </div>
        `).join('');

        const resultsHTML = results.map(p => `
            <div class="sr-autocomplete-item" data-q="${p.nombre}" data-id="${p.id}">
                <span class="sr-autocomplete-icon">🔍</span>${p.nombre}
            </div>
        `).join('');

        container.innerHTML = historyHTML + resultsHTML;
        container.style.display = 'block';

        container.querySelectorAll('.sr-autocomplete-item').forEach(item => {
            item.addEventListener('mousedown', () => {
                const q = item.dataset.q;
                const inp = document.getElementById('srSearchInput');
                if (inp) inp.value = q;
                this.searchQuery = q;
                this.saveSearchHistory(q);
                this.hideAutocomplete();

                if (item.dataset.id) {
                    window.location.href = `product-detail.html?id=${item.dataset.id}`;
                } else {
                    this.applyFiltersAndRender();
                    this.updateURL();
                }
            });
        });
    }

    hideAutocomplete() {
        const container = document.getElementById('srAutocomplete');
        if (container) container.style.display = 'none';
    }

    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('cota480_search_history') || '[]');
        } catch (e) {
            return [];
        }
    }

    saveSearchHistory(query) {
        if (!query) return;
        try {
            let history = this.getSearchHistory();
            history = history.filter(h => h !== query);
            history.unshift(query);
            history = history.slice(0, 10);
            localStorage.setItem('cota480_search_history', JSON.stringify(history));
        } catch (e) {}
    }

    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('cota480_favorites') || '[]');
        } catch (e) {
            return [];
        }
    }

    toggleFavorite(id, btn) {
        try {
            let favs = this.getFavorites();
            const isFav = favs.includes(id);
            if (isFav) {
                favs = favs.filter(f => f !== id);
                if (btn) { btn.classList.remove('active'); btn.innerHTML = '🤍'; }
            } else {
                favs.push(id);
                if (btn) { btn.classList.add('active'); btn.innerHTML = '❤️'; }
            }
            localStorage.setItem('cota480_favorites', JSON.stringify(favs));
            if (typeof NotificacionesComponent !== 'undefined') {
                NotificacionesComponent.mostrar(
                    isFav ? 'Eliminado de favoritos' : '❤️ Guardado en favoritos',
                    'info'
                );
            }
        } catch (e) {}
    }

    renderRecentlyViewed() {
        const section = document.getElementById('srRecentlyViewed');
        const carousel = document.getElementById('srRecentlyCarousel');
        if (!section || !carousel) return;

        try {
            const ids = JSON.parse(localStorage.getItem('cota480_recently_viewed') || '[]');
            const products = ids.map(id => productosService.obtenerPorId(id)).filter(Boolean).slice(0, 6);
            if (products.length === 0) return;

            section.style.display = 'block';
            carousel.innerHTML = products.map(p => `
                <a href="product-detail.html?id=${p.id}" class="related-card">
                    <div class="related-card-img">
                        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
                    </div>
                    <div class="related-card-info">
                        <div class="related-card-name">${p.nombre}</div>
                        <div class="related-card-price">$${Number(p.precio).toLocaleString('es-AR')}</div>
                        <div class="related-card-rating">${'★'.repeat(Math.floor(p.rating || 0))} ${p.rating}</div>
                    </div>
                </a>
            `).join('');
        } catch (e) {}
    }

    updateURL() {
        const params = new URLSearchParams();
        if (this.searchQuery) params.set('q', this.searchQuery);
        if (this.filters.categories.length) params.set('category', this.filters.categories.join(','));
        if (this.filters.minPrice > 0) params.set('minPrice', this.filters.minPrice);
        if (this.filters.maxPrice < Infinity) params.set('maxPrice', this.filters.maxPrice);
        if (this.sortBy !== 'relevance') params.set('sort', this.sortBy);

        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        history.replaceState(null, '', newURL);
    }
}

// The recently viewed section uses related-card styles from product-detail.css
// We need to add the minimal styles inline if product-detail.css isn't loaded
(function ensureRelatedStyles() {
    if (!document.querySelector('link[href*="product-detail"]')) {
        const style = document.createElement('style');
        style.textContent = `
            .related-card { display:block; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden; background:#fff; transition:all 0.3s; text-decoration:none; color:inherit; }
            .related-card:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.12); }
            .related-card-img { aspect-ratio:1; overflow:hidden; background:#f9f9f9; }
            .related-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.3s; }
            .related-card:hover .related-card-img img { transform:scale(1.05); }
            .related-card-info { padding:12px; }
            .related-card-name { font-size:13px; font-weight:600; color:#333; margin-bottom:4px; }
            .related-card-price { font-size:16px; font-weight:800; color:#1a3a47; }
            .related-card-rating { font-size:11px; color:#f5a623; margin-top:3px; }
            .section-title { font-size:22px; font-weight:700; color:#1a3a47; margin-bottom:24px; }
        `;
        document.head.appendChild(style);
    }
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SearchResultsComponent());
} else {
    new SearchResultsComponent();
}
