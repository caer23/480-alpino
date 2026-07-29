/**
 * COMPONENTE: REVIEWS - CONECTA CON LA CREW
 * Sección de reseñas de usuarios
 */

class ReviewsComponent {
    constructor() {
        this.container = getElement('#reviewsSection');
        this.reviews = this.obtenerReviews();
        this.init();
    }

    init() {
        this.render();
    }

    obtenerReviews() {
        return [
            {
                nombre: 'Martina G.',
                foto: null,
                rating: 5,
                comentario: 'Compré una campera Gore-Tex y llegó en perfecto estado. El vendedor fue súper atento, me asesoró sobre el talle y el material. ¡Definitivamente vuelvo!',
                producto: 'Campera Gore-Tex Summit',
                fecha: 'Julio 2026'
            },
            {
                nombre: 'Lucas P.',
                foto: null,
                rating: 5,
                comentario: 'Encontré las botas que buscaba hace meses a un precio increíble. La plataforma es muy segura, pagué con tarjeta sin problemas y el envío fue rapidísimo.',
                producto: 'Botas Freeride 130',
                fecha: 'Junio 2026'
            },
            {
                nombre: 'Valentina R.',
                foto: null,
                rating: 4,
                comentario: 'Super buena experiencia. Vendí mis esquís viejos en menos de una semana. El sistema de cobro es muy práctico, cobré al toque. Lo recomiendo a todos.',
                producto: 'Esquís K2 Mindbender',
                fecha: 'Julio 2026'
            },
            {
                nombre: 'Santiago M.',
                foto: null,
                rating: 5,
                comentario: 'Compré tabla, fijaciones y botas para empezar la temporada. Todo llegó en tiempo y forma. Los productos eran exactamente como los describían. ¡Excelente plataforma!',
                producto: 'Kit Snowboard Completo',
                fecha: 'Mayo 2026'
            },
            {
                nombre: 'Camila T.',
                foto: null,
                rating: 5,
                comentario: 'Me encanta la comunidad de Cota 480. Gente que realmente ama la nieve y el equipamiento. Compré y vendí varias veces, siempre sin problemas. 100% recomendable.',
                producto: 'Casco Ski Race POC',
                fecha: 'Julio 2026'
            },
            {
                nombre: 'Tomás B.',
                foto: null,
                rating: 4,
                comentario: 'Plataforma muy confiable. Publiqué mis productos en minutos y la logística fue impecable. El soporte respondió rápido cuando tuve una consulta. Muy buena experiencia.',
                producto: 'Pantalón Salopette Pro',
                fecha: 'Junio 2026'
            }
        ];
    }

    renderEstrellas(rating) {
        return Array.from({ length: 5 }, (_, i) =>
            `<span class="review-star ${i < rating ? 'filled' : ''}">${i < rating ? '★' : '☆'}</span>`
        ).join('');
    }

    renderAvatar(nombre) {
        const iniciales = nombre
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        return `<div class="review-avatar">${iniciales}</div>`;
    }

    renderReview(review) {
        return `
            <article class="review-card">
                <div class="review-header">
                    ${this.renderAvatar(review.nombre)}
                    <div class="review-user-info">
                        <strong class="review-name">${review.nombre}</strong>
                        <span class="review-date">${review.fecha}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${this.renderEstrellas(review.rating)}
                </div>
                <p class="review-comment">"${review.comentario}"</p>
                <p class="review-product">Compró: <em>${review.producto}</em></p>
            </article>
        `;
    }

    render() {
        if (!this.container) return;

        const reviewsHTML = this.reviews.map(r => this.renderReview(r)).join('');

        this.container.innerHTML = `
            <div class="container">
                <div class="reviews-header">
                    <h2 class="reviews-title">Conecta con la Crew</h2>
                    <p class="reviews-subtitle">Lo que dice nuestra comunidad de apasionados por la nieve.</p>
                </div>
                <div class="reviews-grid">
                    ${reviewsHTML}
                </div>
            </div>
        `;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ReviewsComponent();
    });
} else {
    new ReviewsComponent();
}
