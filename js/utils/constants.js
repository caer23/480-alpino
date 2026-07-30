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
        precio: 45000,
        precioOriginal: 52000,
        descuento: 13,
        imagen: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=600&fit=crop'
        ],
        categoria: 'tablas',
        marca: 'Cota 480',
        descripcion: 'Tabla premium para principiantes y intermedios',
        descripcionLarga: 'La Tabla Snowboard 480 SUMMIT es la opción perfecta para riders que buscan rendimiento y control en toda la montaña. Con su perfil All Mountain Rocker-Camber-Rocker, ofrece la combinación ideal de flotabilidad en nieve fresca y precisión en pistas groomeadas. Construida con núcleo de madera de álamo certificado y capas de fibra de vidrio biaxial, proporciona una respuesta viva y un pop excepcional.',
        caracteristicas: [
            'Perfil Rocker-Camber-Rocker All Mountain',
            'Núcleo de madera de álamo FSC certificado',
            'Capas de fibra de vidrio biaxial + triaxial',
            'Base sinterizada de alta densidad 4800g/m²',
            'Cantos de acero endurecido 2mm',
            'Tip y tail reforzados con kevlar',
            'Acabado mate premium resistente a impactos'
        ],
        especificaciones: {
            'Longitudes disponibles': '148cm / 152cm / 155cm / 158cm / 161cm',
            'Ancho efectivo (155cm)': '255mm',
            'Setback': '20mm',
            'Running Length (155cm)': '1195mm',
            'Radios': '8.2m / 7.3m',
            'Peso rider recomendado': '55-85 kg',
            'Stiffness (Flex)': '6/10 Medium',
            'Material núcleo': 'Álamo FSC + Bamboo',
            'Base': 'Sinterizada 4800 g/m²',
            'Capas': 'Biaxial + Triaxial Glass',
            'Peso tabla (155cm)': '2.8 kg',
            'Terrain': 'All Mountain / Freeride',
            'Nivel rider': 'Intermedio - Avanzado',
            'Temporada': '2025/2026'
        },
        talles: ['148cm', '152cm', '155cm', '158cm', '161cm'],
        colores: [
            { nombre: 'Navy Blue', hex: '#1a3a47' },
            { nombre: 'Blanco Alpino', hex: '#f5f5f5' },
            { nombre: 'Negro Carbono', hex: '#1a1a1a' }
        ],
        stock: { '148cm': 5, '152cm': 3, '155cm': 8, '158cm': 4, '161cm': 2 },
        rating: 4.8,
        totalReviews: 124,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 3,
        reviews: [
            { usuario: 'MatíasR', avatar: 'M', rating: 5, fecha: '2025-06-10', comentario: 'Excelente tabla, muy reactiva. La uso en Las Leñas y responde perfecto tanto en pista como fuera. La construcción es de primer nivel.' },
            { usuario: 'SofíaV', avatar: 'S', rating: 5, fecha: '2025-05-22', comentario: 'Mi primera tabla all mountain y estoy encantada. Buen balance entre flex y rigidez. El pop en saltos es increíble.' },
            { usuario: 'CarlosP', avatar: 'C', rating: 4, fecha: '2025-04-15', comentario: 'Gran tabla para all mountain. La uso en Chapelco y se comporta muy bien. Le doy 4 estrellas porque esperaría un poco más de flotación en polvo profundo.' },
            { usuario: 'LauraM', avatar: 'L', rating: 5, fecha: '2025-03-30', comentario: 'Venía de una tabla de otra marca y el cambio fue notable. Más precisa, mejor pop, excelentes cantos. 100% recomendada.' },
            { usuario: 'AndrésF', avatar: 'A', rating: 5, fecha: '2025-03-08', comentario: 'La mejor tabla que he tenido. Usé el talle 158 y se siente perfecta para mi peso de 78kg. Muy buena construcción.' }
        ],
        faqs: [
            { pregunta: '¿Qué longitud me recomiendan para 75kg y talla 175cm?', respuesta: 'Para esas medidas y un perfil All Mountain recomendamos la talla 155cm o 158cm. Si preferís más flotación en polvo, elegí 158cm.' },
            { pregunta: '¿Las fijaciones están incluidas?', respuesta: 'No, la tabla se vende sin fijaciones. Podés combinarla con las Fijaciones 480 ELITE disponibles en nuestro catálogo.' },
            { pregunta: '¿Tienen garantía?', respuesta: 'Sí, todos nuestros productos tienen garantía de 2 años contra defectos de fabricación.' }
        ],
        relacionados: [2, 4, 5, 6]
    },
    {
        id: 2,
        nombre: "Antiparras '480 VISION PRO'",
        precio: 8500,
        precioOriginal: 12000,
        descuento: 29,
        imagen: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1605908502724-9093a79a333b?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop'
        ],
        categoria: 'optica',
        marca: 'Cota 480',
        descripcion: 'Gafas de esquí con tecnología anti-reflejo y lentes intercambiables',
        descripcionLarga: 'Las Antiparras 480 VISION PRO representan lo último en tecnología óptica para deportes de nieve. Con su sistema de lentes magnéticas intercambiables en 3 segundos y tratamiento anti-UV400, ofrecen claridad visual excepcional en cualquier condición de luz. El marco de policarbonato de triple capa con ventilación estratégica previene el empañamiento incluso en los días más activos.',
        caracteristicas: [
            'Sistema de lentes magnéticas intercambiables Quick-Swap',
            'Protección UV400 certificada',
            'Marco de policarbonato doble inyección',
            'Foam triple densidad anti-alérgico',
            'Ventilación periférica anti-empañamiento',
            'Compatible con casco (OTG - Over The Glasses)',
            'Se incluyen 2 lentes: espejado plateado + lente amarillo para baja luz'
        ],
        especificaciones: {
            'Talla de marco': 'L/XL (unisex)',
            'Tipo de lente': 'Esférica / Cilíndrica',
            'Categoría UV': '400 (UV-A, UV-B, UV-C)',
            'Transmisión lumínica (principal)': '15% - Soleado',
            'Transmisión lumínica (extra)': '55% - Nublado / Nieve',
            'Recubrimiento': 'Anti-reflejo + Anti-rayado',
            'Banda elástica': 'Silicona antideslizante 45mm',
            'Compatible con OTG': 'Sí',
            'Incluye': '2 lentes + estuche rígido + microfibra',
            'Peso': '185g',
            'Material marco': 'Policarbonato TR90',
            'Temporada': '2025/2026'
        },
        talles: ['Talle Único'],
        colores: [
            { nombre: 'Negro/Espejo Plata', hex: '#1a1a1a' },
            { nombre: 'Navy/Espejo Azul', hex: '#1a3a47' },
            { nombre: 'Blanco/Espejo Rosa', hex: '#f5e6e0' }
        ],
        stock: { 'Talle Único': 15 },
        rating: 4.7,
        totalReviews: 89,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 2,
        reviews: [
            { usuario: 'JuanC', avatar: 'J', rating: 5, fecha: '2025-06-15', comentario: 'Excelente calidad óptica. El cambio de lentes en segundos es una maravilla. Lo usé en días de niebla y en sol brillante sin problemas.' },
            { usuario: 'ValeriaT', avatar: 'V', rating: 5, fecha: '2025-05-20', comentario: 'Me sorprendió la calidad para el precio. Los lentes son claros, no se empañan y el foam es muy cómodo. Muy recomendadas.' },
            { usuario: 'PedroG', avatar: 'P', rating: 4, fecha: '2025-04-10', comentario: 'Buenas antiparras, la claridad visual es muy buena. El sistema magnético funciona perfecto. El único punto débil es que la banda podría ser más larga.' },
            { usuario: 'CamilaR', avatar: 'C', rating: 5, fecha: '2025-03-25', comentario: 'Las compré como regalo para mi novio y quedó encantado. Son cómodas, no se empañan y la lente espejada se ve muy bien.' }
        ],
        faqs: [
            { pregunta: '¿Son compatibles con anteojos correctores?', respuesta: 'Sí, tienen sistema OTG (Over The Glasses) que permite usarlas sobre anteojos de hasta 145mm de ancho.' },
            { pregunta: '¿Se pueden comprar lentes adicionales?', respuesta: 'Sí, vendemos lentes extra de forma independiente. Tenemos categorías para sol brillante, nublado, flat light y noche.' },
            { pregunta: '¿Son unisex?', respuesta: 'Sí, el diseño es unisex y el talle L/XL se adapta a la mayoría de los rostros.' }
        ],
        relacionados: [1, 6, 7, 8]
    },
    {
        id: 3,
        nombre: "Kit Splitboard '480 EXPLORE'",
        precio: 180000,
        precioOriginal: 220000,
        descuento: 18,
        imagen: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1526646702739-f17cd22e4cd4?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1605908502724-9093a79a333b?w=600&h=600&fit=crop'
        ],
        categoria: 'kits',
        marca: 'Cota 480',
        descripcion: 'Kit completo de splitboard para backcountry: tabla + fijaciones + pieles',
        descripcionLarga: 'El Kit Splitboard 480 EXPLORE es tu pasaporte al backcountry. Este kit completo incluye una tabla splitboard de alta performance con sistema de separación de doble clic, fijaciones tech específicas para touring y pieles de mohair/nylon de ajuste preciso. Diseñado para riders que quieren explorar más allá de los límites de la pista, con la comodidad de un setup completo y compatible.',
        caracteristicas: [
            'Splitboard 480 EXPLORE con perfil Directional Camber',
            'Núcleo de madera de álamo + refuerzos de bamboo',
            'Sistema de separación Quick-Connect doble clic',
            'Fijaciones Splitboard Tech 480 con modos ski/ride',
            'Pieles de mohair/nylon (65%/35%) con adhesivo termo-activado',
            'Punta y cola de piel con clip de sujeción',
            'Bolsa de pieles incluida',
            'Clip de nariz de piel reforzado acero inox'
        ],
        especificaciones: {
            'Longitudes disponibles': '155cm / 158cm / 161cm / 164cm',
            'Perfil': 'Directional Camber',
            'Ancho efectivo (158cm)': '258mm',
            'Radios': '8.8m / 8.1m',
            'Peso rider recomendado': '65-100 kg',
            'Stiffness (Flex)': '7.5/10 Medium-Stiff',
            'Tipo de fijaciones incluidas': 'Tech Splitboard 480',
            'Pieles incluidas': 'Mohair/Nylon 65/35 - Ancho 130mm',
            'Adhesivo pieles': 'Hot Glue termo-activado',
            'Base tabla': 'Sinterizada 4500 g/m²',
            'Peso total kit (158cm)': '4.1 kg (tabla) + 1.8 kg (fijaciones) + 0.9 kg (pieles)',
            'Nivel rider': 'Avanzado - Experto',
            'Terrain': 'Backcountry / Powder',
            'Temporada': '2025/2026'
        },
        talles: ['155cm', '158cm', '161cm', '164cm'],
        colores: [
            { nombre: 'Alpine White', hex: '#e8e8e8' },
            { nombre: 'Midnight Navy', hex: '#1a3a47' }
        ],
        stock: { '155cm': 3, '158cm': 5, '161cm': 4, '164cm': 2 },
        rating: 4.9,
        totalReviews: 56,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 5,
        reviews: [
            { usuario: 'RobertoM', avatar: 'R', rating: 5, fecha: '2025-06-05', comentario: 'Kit completo de primera calidad. Las pieles se adhieren perfecto y el sistema de fijaciones tech es preciso. Ideal para touring en Los Andes.' },
            { usuario: 'FlorenciaB', avatar: 'F', rating: 5, fecha: '2025-05-18', comentario: 'Mi mejor compra de la temporada. La tabla en modo snowboard es increíblemente buena para el powder. El kit viene muy bien embalado.' },
            { usuario: 'GonzaloH', avatar: 'G', rating: 5, fecha: '2025-04-28', comentario: 'Llevo 3 temporadas con splitboards y este kit es de los mejores. La conversión ski/ride es muy rápida y las fijaciones son muy ajustables.' },
            { usuario: 'NataliaS', avatar: 'N', rating: 4, fecha: '2025-03-12', comentario: 'Excelente kit para backcountry. La única sugerencia es que incluyan bastones o al menos una guía de uso más detallada para principiantes en touring.' }
        ],
        faqs: [
            { pregunta: '¿Es apto para principiantes en backcountry?', respuesta: 'Este kit está pensado para riders con experiencia previa en snowboard. Para backcountry, recomendamos siempre ir con guía certificado y tener equipo de seguridad (avalancha, sonda, pala).' },
            { pregunta: '¿Las fijaciones son compatibles con otras tablas?', respuesta: 'Las fijaciones son específicas para splitboard con sistema de rieles estándar. Son compatibles con la mayoría de splitboards del mercado.' },
            { pregunta: '¿Puedo comprar el kit sin pieles?', respuesta: 'Sí, ofrecemos la tabla y las fijaciones por separado. Consultanos por precio de kit sin pieles.' }
        ],
        relacionados: [1, 4, 5, 8]
    },
    {
        id: 4,
        nombre: "Botas Snowboard '480 PRO'",
        precio: 15000,
        precioOriginal: 18000,
        descuento: 17,
        imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=600&fit=crop'
        ],
        categoria: 'botas',
        marca: 'Cota 480',
        descripcion: 'Botas de snowboard con sistema de ajuste rápido y forro térmico',
        descripcionLarga: 'Las Botas 480 PRO combinan comodidad, calidez y rendimiento. Su sistema de lazo tradicional de doble zona permite un ajuste preciso tanto en el casco como en la caña. El forro interno de calor moldeable Heat-Fit se adapta perfectamente a la forma de tu pie, mientras que la suela Vibram proporciona excelente tracción fuera de la tabla.',
        caracteristicas: [
            'Sistema de lazo doble zona tradicional',
            'Forro interno Heat-Fit moldeable',
            'Suela Vibram de alta tracción',
            'Entresuela EVA de amortiguación',
            'Plantilla anatómica extraíble',
            'Aislamiento térmico 200g',
            'Flex medio (5/10)'
        ],
        especificaciones: {
            'Talles disponibles': '39 / 40 / 41 / 42 / 43 / 44 / 45',
            'Flex': '5/10 Medium',
            'Sistema de cierre': 'Lazo doble zona + gancho superior',
            'Forro': 'Heat-Fit moldeable + Polar 200g',
            'Suela': 'Vibram alta tracción',
            'Temperatura mín. recomendada': '-25°C',
            'Peso (talle 42)': '1.6 kg el par',
            'Nivel rider': 'Principiante - Avanzado',
            'Terrain': 'All Mountain',
            'Temporada': '2025/2026'
        },
        talles: ['39', '40', '41', '42', '43', '44', '45'],
        colores: [
            { nombre: 'Negro/Beige', hex: '#1a1a1a' },
            { nombre: 'Navy', hex: '#1a3a47' }
        ],
        stock: { '39': 4, '40': 6, '41': 8, '42': 10, '43': 9, '44': 5, '45': 3 },
        rating: 4.6,
        totalReviews: 203,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 3,
        reviews: [
            { usuario: 'DiegoL', avatar: 'D', rating: 5, fecha: '2025-06-20', comentario: 'Las mejores botas que tuve. El calor es excelente y el ajuste con el moldeado es increíble. No tengo puntos de presión.' },
            { usuario: 'AlejandraK', avatar: 'A', rating: 4, fecha: '2025-05-10', comentario: 'Muy cómodas y cálidas. El moldeado del forro funciona bien. Solo tardan 2-3 días en adaptarse bien al pie.' }
        ],
        faqs: [
            { pregunta: '¿Cómo se hace el moldeado térmico?', respuesta: 'El forro Heat-Fit se moldea simplemente usándolas. No requiere horno. Con 2-3 días de uso se adaptan perfectamente a tu pie.' },
            { pregunta: '¿Son compatibles con todas las fijaciones?', respuesta: 'Sí, tienen suela estándar compatible con todas las fijaciones de straps del mercado.' }
        ],
        relacionados: [1, 5, 6, 7]
    },
    {
        id: 5,
        nombre: "Fijaciones Snowboard '480 ELITE'",
        precio: 12000,
        precioOriginal: 15000,
        descuento: 20,
        imagen: 'https://images.unsplash.com/photo-1605808551977-8f3b12f3cfef?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1605808551977-8f3b12f3cfef?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=600&h=600&fit=crop'
        ],
        categoria: 'fijaciones',
        marca: 'Cota 480',
        descripcion: 'Fijaciones de snowboard con highback ajustable y baseplate de aluminio',
        descripcionLarga: 'Las Fijaciones 480 ELITE ofrecen la combinación perfecta de respuesta y confort. El highback anatómico ajustable en inclinación y el strap de tobillo con ajuste micro-ratchet aseguran transferencia de energía precisa. La baseplate de aluminio forjado reduce el peso sin sacrificar rigidez.',
        caracteristicas: [
            'Highback anatómico ajustable en inclinación',
            'Strap de tobillo y puntera con ajuste micro-ratchet',
            'Baseplate de aluminio forjado anodizado',
            'Amortiguadores EVA en zona de talón',
            'Compatibles con sistema 4x4 y Burton The Channel',
            'Flex medio-rígido (7/10)',
            'Disponible en tallas S/M y L/XL'
        ],
        especificaciones: {
            'Talles': 'S/M (botas 39-43) / L/XL (botas 44-47)',
            'Flex': '7/10 Medium-Stiff',
            'Baseplate': 'Aluminio forjado 6061-T6',
            'Highback': 'Nylon reforzado con fibra de vidrio',
            'Strap tobillo': 'Micro-ratchet anatómico',
            'Strap puntera': 'Micro-ratchet slim',
            'Compatibilidad': '4x4 + Burton The Channel',
            'Peso (par S/M)': '1.35 kg',
            'Nivel rider': 'Intermedio - Experto',
            'Terrain': 'All Mountain / Freeride',
            'Temporada': '2025/2026'
        },
        talles: ['S/M', 'L/XL'],
        colores: [
            { nombre: 'Negro', hex: '#1a1a1a' },
            { nombre: 'Navy/Beige', hex: '#1a3a47' }
        ],
        stock: { 'S/M': 12, 'L/XL': 8 },
        rating: 4.7,
        totalReviews: 178,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 3,
        reviews: [
            { usuario: 'SantiagoP', avatar: 'S', rating: 5, fecha: '2025-06-01', comentario: 'Fijaciones muy buenas. El ajuste micro-ratchet es muy preciso y la baseplate de aluminio se nota en la respuesta de la tabla.' },
            { usuario: 'MagdalenaR', avatar: 'M', rating: 5, fecha: '2025-05-05', comentario: 'Las uso con las botas 480 PRO y es una combinación perfecta. Muy reactivas y el ajuste es muy cómodo.' }
        ],
        faqs: [
            { pregunta: '¿Son compatibles con la Tabla 480 SUMMIT?', respuesta: 'Sí, son totalmente compatibles ya que ambas usan el sistema 4x4 estándar.' },
            { pregunta: '¿Qué talle me recomiendan para botas 42?', respuesta: 'Para talle 42 de bota, recomendamos el talle S/M.' }
        ],
        relacionados: [1, 4, 6, 7]
    },
    {
        id: 6,
        nombre: "Casco Nieve '480 SHIELD'",
        precio: 9000,
        precioOriginal: 12000,
        descuento: 25,
        imagen: 'https://images.unsplash.com/photo-1583394293214-b865c9c34f1e?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1583394293214-b865c9c34f1e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=600&h=600&fit=crop'
        ],
        categoria: 'proteccion',
        marca: 'Cota 480',
        descripcion: 'Casco certificado CE EN1077 con ventilación ajustable y forro polar',
        descripcionLarga: 'El Casco 480 SHIELD combina seguridad y comodidad en un diseño elegante. Con certificación CE EN1077 para ski y snowboard, ofrece protección de primer nivel. Su sistema de ventilación de 10 rejillas ajustables mantiene la temperatura ideal, mientras que el forro polar extraíble y lavable asegura higiene temporada a temporada.',
        caracteristicas: [
            'Certificación CE EN1077 Clase B',
            'Construcción In-Mold ABS + EPS',
            'Sistema de ventilación con 10 rejillas ajustables',
            'Forro polar extraíble y lavable',
            'Sistema de ajuste de talla Dial-Fit',
            'Compatible con antiparras 480 VISION PRO',
            'Protección de oídos extraíble'
        ],
        especificaciones: {
            'Talles': 'S (52-54cm) / M (55-57cm) / L (58-60cm) / XL (61-63cm)',
            'Certificación': 'CE EN1077:2007 Clase B',
            'Construcción': 'In-Mold ABS + EPS bilaminar',
            'Ventilación': '10 rejillas ajustables',
            'Ajuste': 'Sistema Dial-Fit rotatorio',
            'Forro': 'Polar extraíble + lavable',
            'Peso (M)': '480g',
            'Temperatura mín.': '-30°C con forro',
            'Compatible con anteojos': 'Sí (OTG)',
            'Nivel rider': 'Todos',
            'Temporada': '2025/2026'
        },
        talles: ['S', 'M', 'L', 'XL'],
        colores: [
            { nombre: 'Negro Mate', hex: '#1a1a1a' },
            { nombre: 'Navy', hex: '#1a3a47' },
            { nombre: 'Blanco', hex: '#f5f5f5' }
        ],
        stock: { 'S': 8, 'M': 15, 'L': 12, 'XL': 6 },
        rating: 4.8,
        totalReviews: 315,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 2,
        reviews: [
            { usuario: 'EzequielM', avatar: 'E', rating: 5, fecha: '2025-06-18', comentario: 'Muy cómodo y liviano. El sistema de ajuste Dial-Fit es fantástico. Lo uso en Cerro Catedral y se ve genial también.' },
            { usuario: 'PatriciaV', avatar: 'P', rating: 5, fecha: '2025-05-28', comentario: 'Excelente relación calidad-precio. Compatible perfecto con las antiparras 480. La ventilación funciona muy bien.' }
        ],
        faqs: [
            { pregunta: '¿Qué talle me corresponde con 56cm de cabeza?', respuesta: 'Con 56cm de perímetro de cabeza, el talle M (55-57cm) es el indicado.' },
            { pregunta: '¿Está aprobado para competencias?', respuesta: 'Sí, cuenta con certificación CE EN1077 Clase B, válida para la mayoría de competencias amateurs y algunas profesionales.' }
        ],
        relacionados: [2, 4, 7, 8]
    },
    {
        id: 7,
        nombre: "Chaqueta Nieve '480 ALPINE'",
        precio: 25000,
        precioOriginal: 35000,
        descuento: 29,
        imagen: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=600&h=600&fit=crop'
        ],
        categoria: 'ropa',
        marca: 'Cota 480',
        descripcion: 'Chaqueta técnica impermeable 20K con costuras selladas y ventilación',
        descripcionLarga: 'La Chaqueta 480 ALPINE está diseñada para los riders más exigentes. Con su membrana impermeable 20.000mm/20.000g resistencia a la presión y transpiración, mantiene el calor adentro y la humedad afuera. Las costuras selladas y los cierres impermeables completaN la protección total.',
        caracteristicas: [
            'Membrana impermeable 20.000mm de resistencia',
            'Transpirabilidad 20.000g/m²/24hs',
            'Costuras completamente selladas',
            'Cierres YKK impermeables',
            'Capucha ajustable y extraíble',
            'Ventilaciones axilares con cremallera',
            '5 bolsillos interiores y exteriores',
            'Puños ajustables con velcro + manchón interior'
        ],
        especificaciones: {
            'Talles': 'XS / S / M / L / XL / XXL',
            'Impermeabilidad': '20.000mm',
            'Transpirabilidad': '20.000g/m²/24h',
            'Membrana': '3 capas laminadas',
            'Relleno': 'Primaloft® Gold 80g cuerpo / 40g mangas',
            'Temperatura mín.': '-20°C',
            'Peso (M)': '1.3 kg',
            'Costuras': 'Completamente selladas',
            'Cierres': 'YKK impermeables',
            'Nivel rider': 'Todos',
            'Temporada': '2025/2026'
        },
        talles: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colores: [
            { nombre: 'Navy/Beige', hex: '#1a3a47' },
            { nombre: 'Negro/Gris', hex: '#1a1a1a' },
            { nombre: 'Blanco/Navy', hex: '#f5f5f5' }
        ],
        stock: { 'XS': 5, 'S': 8, 'M': 12, 'L': 10, 'XL': 7, 'XXL': 4 },
        rating: 4.7,
        totalReviews: 142,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 3,
        reviews: [
            { usuario: 'NicolásA', avatar: 'N', rating: 5, fecha: '2025-06-12', comentario: 'Excelente chaqueta. La impermeabilidad es real, la usé en nevadas fuertes y no entró agua. El Primaloft® mantiene el calor muy bien.' },
            { usuario: 'ClarissaO', avatar: 'C', rating: 4, fecha: '2025-05-15', comentario: 'Muy buena chaqueta. El único punto a mejorar es que el talle M me quedó un poco grande en los hombros, siendo mujer. Recomendaría pedir un talle menos.' }
        ],
        faqs: [
            { pregunta: '¿Puedo lavarla en lavarropas?', respuesta: 'Sí, se puede lavar a máquina en ciclo delicado a 30°C. Recomendamos usar detergente especial para prendas técnicas y secarla a baja temperatura.' },
            { pregunta: '¿La capucha entra dentro del casco 480 SHIELD?', respuesta: 'Sí, la capucha está diseñada para ser compatible con el casco 480 SHIELD y la mayoría de los cascos de nieve del mercado.' }
        ],
        relacionados: [6, 4, 8, 5]
    },
    {
        id: 8,
        nombre: "Guantes Nieve '480 GRIP'",
        precio: 4500,
        precioOriginal: 6000,
        descuento: 25,
        imagen: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
        imagenes: [
            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1535577884997-a0f5025b3f04?w=600&h=600&fit=crop'
        ],
        categoria: 'accesorios',
        marca: 'Cota 480',
        descripcion: 'Guantes impermeables con relleno de pluma y palma de cuero',
        descripcionLarga: 'Los Guantes 480 GRIP ofrecen calor, impermeabilidad y agarre en un solo producto. Con su exterior de nylon ripstop tratado DWR, membrana impermeable y relleno de pluma 550-fill, mantienen las manos calientes incluso en los días más fríos. La palma de cuero de cabra garantiza agarre y durabilidad.',
        caracteristicas: [
            'Exterior Nylon Ripstop con tratamiento DWR',
            'Membrana impermeable insertada',
            'Relleno Pluma 550-Fill Power',
            'Palma cuero de cabra reforzada',
            'Puño largo ajustable sobre la manga',
            'Trabilla de gancho para llevar colgados',
            'Indicador de temperatura táctil',
            'Compatible con pantallas táctiles (2 dedos)'
        ],
        especificaciones: {
            'Talles': 'XS / S / M / L / XL',
            'Impermeabilidad': '10.000mm',
            'Relleno': 'Pluma 550-Fill Power 80g',
            'Palma': 'Cuero de cabra reforzado',
            'Exterior': 'Nylon Ripstop DWR',
            'Temperatura mín.': '-25°C',
            'Pantalla táctil': 'Sí (2 dedos)',
            'Peso (par M)': '380g',
            'Nivel rider': 'Todos',
            'Temporada': '2025/2026'
        },
        talles: ['XS', 'S', 'M', 'L', 'XL'],
        colores: [
            { nombre: 'Negro', hex: '#1a1a1a' },
            { nombre: 'Navy', hex: '#1a3a47' },
            { nombre: 'Beige', hex: '#E8D5C4' }
        ],
        stock: { 'XS': 10, 'S': 12, 'M': 15, 'L': 14, 'XL': 8 },
        rating: 4.5,
        totalReviews: 267,
        vendedor: { nombre: 'Cota 480 Oficial', ventas: 1850, rating: 4.9, respuesta: '< 1 hora' },
        envio: 'Gratis',
        diasEntrega: 2,
        reviews: [
            { usuario: 'FernandoC', avatar: 'F', rating: 5, fecha: '2025-06-22', comentario: 'Excelentes guantes. El cuero de la palma aguanta muy bien los bastones y las caídas. Las manos siempre calientes incluso a -15°C.' },
            { usuario: 'MartinaL', avatar: 'M', rating: 4, fecha: '2025-05-30', comentario: 'Muy buenos guantes. La función táctil es práctica para el celular. El único contra es que el puño largo me queda un poco apretado sobre la chaqueta.' }
        ],
        faqs: [
            { pregunta: '¿Se mojan con nieve?', respuesta: 'No, el tratamiento DWR repele el agua y la membrana impermeable evita que entre humedad. Perfectos para nieve húmeda.' },
            { pregunta: '¿Qué talle es para mano de 20cm de largo?', respuesta: 'Para mano de 20cm recomendamos talle M.' }
        ],
        relacionados: [6, 7, 2, 4]
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