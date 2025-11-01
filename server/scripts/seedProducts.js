import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  // AVES - Perchas y columpios (3 productos)
  {
    name: "Percha Natural de Manzano",
    description: "Percha de madera natural de manzano con diferentes diámetros para ejercitar las patas de las aves.",
    price: 18990,
    category: "aves",
    subcategory: "perchas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.7,
    reviews: 18,
    tags: ["percha", "natural", "manzano", "ejercicio"]
  },
  {
    name: "Columpio con Campanas",
    description: "Columpio interactivo con campanas que estimula el juego y ejercicio de aves medianas.",
    price: 14990,
    category: "aves",
    subcategory: "perchas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 32,
    rating: 4.5,
    reviews: 24,
    tags: ["columpio", "campanas", "interactivo", "juego"]
  },
  {
    name: "Percha Mineral con Calcio",
    description: "Percha enriquecida con minerales y calcio para mantener el pico y las uñas en perfecto estado.",
    price: 22990,
    category: "aves",
    subcategory: "perchas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.8,
    reviews: 15,
    tags: ["percha", "mineral", "calcio", "salud"]
  },

  // AVES - Nidos (3 productos)
  {
    name: "Nido de Mimbre Natural",
    description: "Nido tejido a mano con mimbre natural, perfecto para canarios y especies pequeñas.",
    price: 16990,
    category: "aves",
    subcategory: "nidos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 28,
    rating: 4.6,
    reviews: 22,
    tags: ["nido", "mimbre", "natural", "canarios"]
  },
  {
    name: "Casa Nido de Madera",
    description: "Casa nido de madera maciza con entrada regulable, ideal para periquitos y agapornis.",
    price: 24990,
    category: "aves",
    subcategory: "nidos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 19,
    tags: ["casa", "nido", "madera", "periquitos"]
  },
  {
    name: "Nido Colgante de Fibra",
    description: "Nido colgante hecho de fibras naturales, suave y cómodo para aves reproductoras.",
    price: 19990,
    category: "aves",
    subcategory: "nidos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 22,
    rating: 4.4,
    reviews: 16,
    tags: ["nido", "colgante", "fibra", "reproducción"]
  },

  // AVES - Arneses (3 productos)
  {
    name: "Arnés Ajustable para Loros",
    description: "Arnés de seguridad ajustable con correa para paseos seguros con loros grandes.",
    price: 34990,
    category: "aves",
    subcategory: "arneses",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.7,
    reviews: 8,
    tags: ["arnés", "ajustable", "loros", "paseos"]
  },
  {
    name: "Arnés de Vuelo para Aves Medianas",
    description: "Arnés ligero diseñado para permitir vuelo controlado en aves medianas como cacatúas.",
    price: 42990,
    category: "aves",
    subcategory: "arneses",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 8,
    rating: 4.9,
    reviews: 5,
    tags: ["arnés", "vuelo", "controlado", "cacatúas"]
  },
  {
    name: "Arnés de Entrenamiento Básico",
    description: "Arnés básico para acostumbrar gradualmente a las aves al uso de arneses.",
    price: 28990,
    category: "aves",
    subcategory: "arneses",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 16,
    rating: 4.3,
    reviews: 12,
    tags: ["arnés", "entrenamiento", "básico", "adaptación"]
  },

  // AVES - Comederos (3 productos)
  {
    name: "Comedero Anti-Desperdicio Doble",
    description: "Sistema de alimentación dual que evita el desperdicio de semillas. Perfecto para aves medianas y grandes.",
    price: 24990,
    category: "aves",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 32,
    rating: 4.6,
    reviews: 18,
    tags: ["comedero", "anti-desperdicio", "doble"]
  },
  {
    name: "Comedero de Acero Inoxidable",
    description: "Comedero pesado de acero inoxidable que evita volcamientos y es fácil de limpiar.",
    price: 18990,
    category: "aves",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 45,
    rating: 4.8,
    reviews: 28,
    tags: ["comedero", "acero", "inoxidable", "pesado"]
  },
  {
    name: "Comedero Automático Programable",
    description: "Dispensador automático de alimento con temporizador para alimentación regular.",
    price: 67990,
    category: "aves",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 14,
    rating: 4.5,
    reviews: 11,
    tags: ["comedero", "automático", "programable", "temporizador"]
  },

  // AVES - Bebederos (3 productos)
  {
    name: "Bebedero Automático con Filtro",
    description: "Bebedero con sistema de filtrado y recarga automática. Mantiene el agua siempre fresca y limpia.",
    price: 34990,
    category: "aves",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 28,
    rating: 4.7,
    reviews: 15,
    tags: ["bebedero", "automático", "filtro"]
  },
  {
    name: "Bebedero de Vidrio Antigoteo",
    description: "Bebedero de vidrio con sistema antigoteo, higiénico y fácil de limpiar.",
    price: 16990,
    category: "aves",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 38,
    rating: 4.4,
    reviews: 22,
    tags: ["bebedero", "vidrio", "antigoteo", "higiénico"]
  },
  {
    name: "Fuente de Agua Circulante",
    description: "Fuente con agua en movimiento que estimula a las aves a beber más agua.",
    price: 54990,
    category: "aves",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 12,
    rating: 4.9,
    reviews: 7,
    tags: ["fuente", "circulante", "movimiento", "estimulante"]
  },

  // AVES - Juguetes (3 productos)
  {
    name: "Juguete Colgante con Cuerdas",
    description: "Juguete interactivo con cuerdas naturales y piezas de madera para estimular el juego.",
    price: 18990,
    category: "aves",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 35,
    rating: 4.6,
    reviews: 26,
    tags: ["juguete", "colgante", "cuerdas", "madera"]
  },
  {
    name: "Rompecabezas de Forrajeo",
    description: "Juguete educativo que estimula el comportamiento natural de forrajeo en aves inteligentes.",
    price: 32990,
    category: "aves",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 18,
    rating: 4.8,
    reviews: 14,
    tags: ["rompecabezas", "forrajeo", "educativo", "inteligencia"]
  },
  {
    name: "Espejo con Campana Musical",
    description: "Espejo seguro con campana que produce sonidos musicales para entretenimiento.",
    price: 12990,
    category: "aves",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 42,
    rating: 4.3,
    reviews: 31,
    tags: ["espejo", "campana", "musical", "entretenimiento"]
  },

  // AVES - Escondites (3 productos)
  {
    name: "Casa de Madera Natural",
    description: "Refugio de madera natural con múltiples entradas para que las aves se sientan seguras.",
    price: 28990,
    category: "aves",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 22,
    rating: 4.7,
    reviews: 19,
    tags: ["casa", "madera", "natural", "refugio"]
  },
  {
    name: "Cueva de Felpa Colgante",
    description: "Escondite suave y cálido que se cuelga en la jaula, perfecto para el descanso.",
    price: 24990,
    category: "aves",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 28,
    rating: 4.5,
    reviews: 23,
    tags: ["cueva", "felpa", "colgante", "descanso"]
  },
  {
    name: "Refugio de Bambú Ecológico",
    description: "Escondite hecho de bambú natural, ecológico y resistente para aves de todos los tamaños.",
    price: 21990,
    category: "aves",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.6,
    reviews: 17,
    tags: ["refugio", "bambú", "ecológico", "resistente"]
  },

  // AVES - Jaulas y pajareras (3 productos)
  {
    name: "Jaula Hexagonal Premium",
    description: "Jaula espaciosa de acero inoxidable con múltiples perchas y comederos integrados.",
    price: 189990,
    category: "aves",
    subcategory: "jaulas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 8,
    rating: 4.8,
    reviews: 12,
    tags: ["jaula", "hexagonal", "premium", "espaciosa"]
  },
  {
    name: "Pajarera de Exterior Grande",
    description: "Pajarera amplia para exterior con techo impermeable y múltiples niveles.",
    price: 349990,
    category: "aves",
    subcategory: "jaulas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 4,
    rating: 4.9,
    reviews: 6,
    tags: ["pajarera", "exterior", "grande", "impermeable"]
  },
  {
    name: "Jaula de Viaje Plegable",
    description: "Jaula ligera y plegable ideal para transportar aves en viajes cortos.",
    price: 67990,
    category: "aves",
    subcategory: "jaulas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.4,
    reviews: 18,
    tags: ["jaula", "viaje", "plegable", "ligera"]
  },

  // AVES - Alimentación (3 productos)
  {
    name: "Mezcla Premium de Semillas",
    description: "Mezcla balanceada de semillas de alta calidad para aves tropicales y canarios.",
    price: 24990,
    category: "aves",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 45,
    rating: 4.7,
    reviews: 32,
    tags: ["semillas", "premium", "balanceada", "tropical"]
  },
  {
    name: "Pellets Nutricionales Completos",
    description: "Alimento completo en pellets con todos los nutrientes esenciales para aves.",
    price: 32990,
    category: "aves",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 38,
    rating: 4.8,
    reviews: 24,
    tags: ["pellets", "nutricionales", "completos", "esenciales"]
  },
  {
    name: "Suplemento Vitamínico Líquido",
    description: "Complemento vitamínico líquido para fortalecer el sistema inmunológico de las aves.",
    price: 18990,
    category: "aves",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 28,
    rating: 4.6,
    reviews: 19,
    tags: ["suplemento", "vitamínico", "líquido", "inmunológico"]
  },

  // AVES - Higiene y salud (3 productos)
  {
    name: "Bañera para Aves con Espejo",
    description: "Bañera especial con espejo incorporado que estimula el baño natural de las aves.",
    price: 16990,
    category: "aves",
    subcategory: "higiene",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 32,
    rating: 4.5,
    reviews: 26,
    tags: ["bañera", "espejo", "baño", "natural"]
  },
  {
    name: "Spray Desinfectante para Jaulas",
    description: "Desinfectante seguro y efectivo para limpiar jaulas y accesorios de aves.",
    price: 12990,
    category: "aves",
    subcategory: "higiene",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 48,
    rating: 4.7,
    reviews: 35,
    tags: ["spray", "desinfectante", "seguro", "efectivo"]
  },
  {
    name: "Kit de Primeros Auxilios Aviar",
    description: "Kit completo de primeros auxilios con medicamentos básicos para emergencias aviares.",
    price: 45990,
    category: "aves",
    subcategory: "higiene",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 12,
    rating: 4.9,
    reviews: 8,
    tags: ["kit", "primeros auxilios", "medicamentos", "emergencias"]
  },

  // AVES - Transportadoras (3 productos)
  {
    name: "Transportadora Rígida de Seguridad",
    description: "Transportadora rígida con ventilación óptima y cierre de seguridad para viajes largos.",
    price: 54990,
    category: "aves",
    subcategory: "transportadoras",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.8,
    reviews: 14,
    tags: ["transportadora", "rígida", "seguridad", "ventilación"]
  },
  {
    name: "Bolsa de Transporte Suave",
    description: "Bolsa de transporte suave y cómoda para aves pequeñas en trayectos cortos.",
    price: 32990,
    category: "aves",
    subcategory: "transportadoras",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.4,
    reviews: 21,
    tags: ["bolsa", "transporte", "suave", "cómoda"]
  },
  {
    name: "Jaula de Emergencia Plegable",
    description: "Jaula de emergencia que se pliega fácilmente para situaciones imprevistas.",
    price: 42990,
    category: "aves",
    subcategory: "transportadoras",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.6,
    reviews: 12,
    tags: ["jaula", "emergencia", "plegable", "imprevistas"]
  },

  // MAMÍFEROS - Camas (3 productos)
  {
    name: "Cama Ortopédica Memory Foam",
    description: "Cama de espuma viscoelástica con funda lavable. Ideal para perros de razas grandes y senior.",
    price: 89990,
    category: "mamiferos",
    subcategory: "camas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.8,
    reviews: 34,
    tags: ["cama", "ortopédica", "memory foam", "senior"]
  },
  {
    name: "Hamaca Colgante de Felpa",
    description: "Hamaca súper suave y cómoda para el descanso de pequeños mamíferos. Fácil de lavar y instalar.",
    price: 12990,
    category: "mamiferos",
    subcategory: "camas",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400",
    stock: 67,
    rating: 4.4,
    reviews: 42,
    tags: ["hamaca", "felpa", "cómoda", "lavable"]
  },
  {
    name: "Cama Térmica Autorregulable",
    description: "Cama que mantiene la temperatura corporal ideal sin electricidad, perfecta para gatos y perros pequeños.",
    price: 45990,
    category: "mamiferos",
    subcategory: "camas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 22,
    rating: 4.7,
    reviews: 18,
    tags: ["cama", "térmica", "autorregulable", "temperatura"]
  },

  // MAMÍFEROS - Bebederos (3 productos)
  {
    name: "Fuente de Agua Automática",
    description: "Fuente con filtro de carbón que mantiene el agua fresca y estimula a beber más.",
    price: 67990,
    category: "mamiferos",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 22,
    tags: ["fuente", "automática", "filtro", "carbón"]
  },
  {
    name: "Bebedero de Acero Inoxidable",
    description: "Bebedero pesado de acero inoxidable antideslizante, higiénico y duradero.",
    price: 24990,
    category: "mamiferos",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 38,
    rating: 4.6,
    reviews: 29,
    tags: ["bebedero", "acero", "antideslizante", "duradero"]
  },
  {
    name: "Dispensador de Agua para Jaulas",
    description: "Dispensador que se acopla a jaulas de roedores con sistema antigoteo.",
    price: 18990,
    category: "mamiferos",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 45,
    rating: 4.4,
    reviews: 35,
    tags: ["dispensador", "jaulas", "roedores", "antigoteo"]
  },

  // MAMÍFEROS - Comederos (3 productos)
  {
    name: "Comedero Elevado Ajustable",
    description: "Comedero con altura ajustable que mejora la postura durante la alimentación.",
    price: 34990,
    category: "mamiferos",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 28,
    rating: 4.7,
    reviews: 24,
    tags: ["comedero", "elevado", "ajustable", "postura"]
  },
  {
    name: "Comedero Lento Anti-Ansiedad",
    description: "Comedero diseñado para ralentizar la alimentación y reducir la ansiedad por comida.",
    price: 28990,
    category: "mamiferos",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 32,
    rating: 4.8,
    reviews: 19,
    tags: ["comedero", "lento", "anti-ansiedad", "ralentizar"]
  },
  {
    name: "Comedero Automático Programable",
    description: "Dispensador automático con temporizador para múltiples comidas al día.",
    price: 89990,
    category: "mamiferos",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 14,
    rating: 4.5,
    reviews: 16,
    tags: ["comedero", "automático", "programable", "temporizador"]
  },

  // MAMÍFEROS - Escondites (3 productos)
  {
    name: "Casa Iglú para Mascotas",
    description: "Refugio cómodo y cálido con forma de iglú, perfecto para descansar.",
    price: 45990,
    category: "mamiferos",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.8,
    reviews: 26,
    tags: ["iglú", "refugio", "cálido", "descanso"]
  },
  {
    name: "Túnel de Juego Plegable",
    description: "Túnel extensible que sirve como escondite y área de juego.",
    price: 29990,
    category: "mamiferos",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.5,
    reviews: 19,
    tags: ["túnel", "plegable", "juego", "extensible"]
  },
  {
    name: "Cueva de Felpa Premium",
    description: "Escondite suave y acogedor hecho con materiales de alta calidad.",
    price: 39990,
    category: "mamiferos",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.7,
    reviews: 31,
    tags: ["cueva", "felpa", "premium", "acogedor"]
  },

  // MAMÍFEROS - Juguetes (3 productos)
  {
    name: "Pelota Interactiva con Sonido",
    description: "Pelota que emite sonidos y se mueve automáticamente para estimular el juego.",
    price: 24990,
    category: "mamiferos",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 35,
    rating: 4.6,
    reviews: 42,
    tags: ["pelota", "interactiva", "sonido", "automática"]
  },
  {
    name: "Cuerda de Algodón Natural",
    description: "Juguete de cuerda resistente hecho con algodón 100% natural.",
    price: 12990,
    category: "mamiferos",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 50,
    rating: 4.4,
    reviews: 28,
    tags: ["cuerda", "algodón", "natural", "resistente"]
  },
  {
    name: "Puzzle Dispensador de Premios",
    description: "Juguete mental que desafía a la mascota a resolver puzzles para obtener premios.",
    price: 32990,
    category: "mamiferos",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 28,
    rating: 4.8,
    reviews: 36,
    tags: ["puzzle", "mental", "premios", "desafío"]
  },

  // MAMÍFEROS - Alimentación (3 productos)
  {
    name: "Alimento Premium para Perros",
    description: "Alimento balanceado con ingredientes naturales y proteínas de alta calidad.",
    price: 54990,
    category: "mamiferos",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 40,
    rating: 4.9,
    reviews: 67,
    tags: ["premium", "balanceado", "natural", "proteínas"]
  },
  {
    name: "Snacks Dentales Naturales",
    description: "Premios que ayudan a mantener la higiene dental mientras disfrutan.",
    price: 18990,
    category: "mamiferos",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 60,
    rating: 4.7,
    reviews: 45,
    tags: ["snacks", "dentales", "naturales", "higiene"]
  },
  {
    name: "Suplemento Vitamínico",
    description: "Complemento nutricional con vitaminas y minerales esenciales.",
    price: 29990,
    category: "mamiferos",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    stock: 35,
    rating: 4.6,
    reviews: 23,
    tags: ["suplemento", "vitamínico", "minerales", "nutricional"]
  },

  // MAMÍFEROS - Higiene y Cuidado (3 productos)
  {
    name: "Champú Hipoalergénico",
    description: "Champú suave especialmente formulado para pieles sensibles.",
    price: 22990,
    category: "mamiferos",
    subcategory: "higiene",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 45,
    rating: 4.8,
    reviews: 38,
    tags: ["champú", "hipoalergénico", "suave", "sensibles"]
  },
  {
    name: "Kit de Cepillado Profesional",
    description: "Set completo con cepillos y peines para diferentes tipos de pelaje.",
    price: 34990,
    category: "mamiferos",
    subcategory: "higiene",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 30,
    rating: 4.7,
    reviews: 29,
    tags: ["kit", "cepillado", "profesional", "pelaje"]
  },
  {
    name: "Toallitas Húmedas Antibacteriales",
    description: "Toallitas de limpieza rápida con propiedades antibacteriales.",
    price: 15990,
    category: "mamiferos",
    subcategory: "higiene",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 55,
    rating: 4.5,
    reviews: 41,
    tags: ["toallitas", "húmedas", "antibacteriales", "limpieza"]
  },

  // MAMÍFEROS - Jaulas y Corrales (3 productos)
  {
    name: "Corral Plegable para Cachorros",
    description: "Corral de entrenamiento plegable, ideal para cachorros y mascotas pequeñas.",
    price: 89990,
    category: "mamiferos",
    subcategory: "jaulas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.6,
    reviews: 22,
    tags: ["corral", "plegable", "cachorros", "entrenamiento"]
  },
  {
    name: "Jaula de Transporte Resistente",
    description: "Jaula robusta para transporte seguro, aprobada por aerolíneas.",
    price: 124990,
    category: "mamiferos",
    subcategory: "jaulas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.8,
    reviews: 18,
    tags: ["jaula", "transporte", "resistente", "aerolíneas"]
  },
  {
    name: "Parque de Juegos Modular",
    description: "Sistema modular que se puede configurar en diferentes formas y tamaños.",
    price: 159990,
    category: "mamiferos",
    subcategory: "jaulas",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 8,
    rating: 4.9,
    reviews: 14,
    tags: ["parque", "modular", "configurable", "juegos"]
  },

  // MAMÍFEROS - Transportadoras y Viaje (3 productos)
  {
    name: "Mochila Transportadora Ventilada",
    description: "Mochila cómoda con ventilación superior para mascotas pequeñas.",
    price: 67990,
    category: "mamiferos",
    subcategory: "transportadoras",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.7,
    reviews: 25,
    tags: ["mochila", "ventilada", "cómoda", "pequeñas"]
  },
  {
    name: "Bolso de Viaje con Ruedas",
    description: "Transportadora con ruedas y mango telescópico para viajes largos.",
    price: 94990,
    category: "mamiferos",
    subcategory: "transportadoras",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 19,
    tags: ["bolso", "ruedas", "telescópico", "viajes"]
  },
  {
    name: "Asiento de Auto Seguro",
    description: "Asiento elevador con arnés de seguridad para viajes en automóvil.",
    price: 45990,
    category: "mamiferos",
    subcategory: "transportadoras",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.6,
    reviews: 33,
    tags: ["asiento", "auto", "seguro", "arnés"]
  },

  // REPTILES - Bebederos y Comederos (3 productos)
  {
    name: "Comedero de Roca Natural",
    description: "Comedero que imita rocas naturales, perfecto para reptiles terrestres.",
    price: 24990,
    category: "reptiles",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 30,
    rating: 4.6,
    reviews: 22,
    tags: ["comedero", "roca", "natural", "terrestres"]
  },
  {
    name: "Bebedero con Cascada",
    description: "Sistema de agua circulante que mantiene el agua fresca y oxigenada.",
    price: 67990,
    category: "reptiles",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 18,
    tags: ["bebedero", "cascada", "circulante", "oxigenada"]
  },
  {
    name: "Plato Hondo Antideslizante",
    description: "Plato profundo con base antideslizante para agua y alimento.",
    price: 18990,
    category: "reptiles",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 40,
    rating: 4.5,
    reviews: 35,
    tags: ["plato", "hondo", "antideslizante", "profundo"]
  },

  // REPTILES - Escondites (3 productos)
  {
    name: "Cueva de Resina Natural",
    description: "Refugio realista hecho de resina que imita formaciones rocosas naturales.",
    price: 39990,
    category: "reptiles",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.7,
    reviews: 28,
    tags: ["cueva", "resina", "natural", "realista"]
  },
  {
    name: "Tronco Hueco Decorativo",
    description: "Escondite en forma de tronco hueco, perfecto para especies arbóreas.",
    price: 32990,
    category: "reptiles",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.6,
    reviews: 19,
    tags: ["tronco", "hueco", "decorativo", "arbóreas"]
  },
  {
    name: "Refugio de Corteza Natural",
    description: "Escondite hecho con corteza natural, ideal para crear ambientes realistas.",
    price: 26990,
    category: "reptiles",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 35,
    rating: 4.5,
    reviews: 24,
    tags: ["refugio", "corteza", "natural", "realistas"]
  },

  // REPTILES - Sustratos y Decoración (3 productos)
  {
    name: "Sustrato de Fibra de Coco",
    description: "Sustrato natural que retiene humedad, ideal para especies tropicales.",
    price: 19990,
    category: "reptiles",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 50,
    rating: 4.8,
    reviews: 42,
    tags: ["sustrato", "fibra", "coco", "humedad"]
  },
  {
    name: "Arena de Calcio Digestible",
    description: "Arena especial que puede ser digerida sin causar impactación.",
    price: 22990,
    category: "reptiles",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 45,
    rating: 4.6,
    reviews: 31,
    tags: ["arena", "calcio", "digestible", "segura"]
  },
  {
    name: "Musgo Preservado Natural",
    description: "Musgo natural preservado que mantiene la humedad y decora el terrario.",
    price: 15990,
    category: "reptiles",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 60,
    rating: 4.7,
    reviews: 38,
    tags: ["musgo", "preservado", "natural", "decorativo"]
  },

  // REPTILES - Alimentación y Suplementos (3 productos)
  {
    name: "Pellets para Iguanas",
    description: "Alimento balanceado específicamente formulado para iguanas y reptiles herbívoros.",
    price: 34990,
    category: "reptiles",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 35,
    rating: 4.8,
    reviews: 26,
    tags: ["pellets", "iguanas", "balanceado", "herbívoros"]
  },
  {
    name: "Suplemento de Calcio con D3",
    description: "Polvo de calcio enriquecido con vitamina D3 para fortalecer huesos y caparazón.",
    price: 18990,
    category: "reptiles",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 55,
    rating: 4.9,
    reviews: 48,
    tags: ["suplemento", "calcio", "D3", "huesos"]
  },
  {
    name: "Grillos Deshidratados Premium",
    description: "Grillos deshidratados ricos en proteínas, perfectos para reptiles insectívoros.",
    price: 24990,
    category: "reptiles",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 40,
    rating: 4.7,
    reviews: 33,
    tags: ["grillos", "deshidratados", "proteínas", "insectívoros"]
  },

  // REPTILES - Termostatos (3 productos)
  {
    name: "Termostato Digital Preciso",
    description: "Controlador de temperatura digital con precisión de ±1°C.",
    price: 89990,
    category: "reptiles",
    subcategory: "termostatos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.9,
    reviews: 22,
    tags: ["termostato", "digital", "preciso", "controlador"]
  },
  {
    name: "Termostato Día/Noche",
    description: "Sistema que permite diferentes temperaturas para ciclos diurnos y nocturnos.",
    price: 124990,
    category: "reptiles",
    subcategory: "termostatos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 18,
    tags: ["termostato", "día", "noche", "ciclos"]
  },
  {
    name: "Termostato Básico Analógico",
    description: "Controlador de temperatura simple y confiable para principiantes.",
    price: 45990,
    category: "reptiles",
    subcategory: "termostatos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 30,
    rating: 4.5,
    reviews: 25,
    tags: ["termostato", "básico", "analógico", "principiantes"]
  },

  // REPTILES - Terrarios (3 productos)
  {
    name: "Terrario de Vidrio 120x60x60",
    description: "Terrario espacioso de vidrio templado con ventilación frontal y superior para reptiles grandes.",
    price: 299990,
    category: "reptiles",
    subcategory: "terrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 8,
    rating: 4.9,
    reviews: 15,
    tags: ["terrario", "vidrio", "espacioso", "ventilación"]
  },
  {
    name: "Terrario Compacto para Geckos",
    description: "Terrario vertical de 45x45x60cm ideal para geckos y especies arbóreas pequeñas.",
    price: 149990,
    category: "reptiles",
    subcategory: "terrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.7,
    reviews: 22,
    tags: ["terrario", "compacto", "geckos", "vertical"]
  },
  {
    name: "Terrario Modular Expandible",
    description: "Sistema modular que permite expandir el espacio según las necesidades del reptil.",
    price: 199990,
    category: "reptiles",
    subcategory: "terrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 6,
    rating: 4.8,
    reviews: 11,
    tags: ["terrario", "modular", "expandible", "flexible"]
  },

  // REPTILES - Calefacción (3 productos)
  {
    name: "Lámpara Cerámica de Calor 100W",
    description: "Emisor de calor cerámico que no emite luz, ideal para calefacción nocturna.",
    price: 34990,
    category: "reptiles",
    subcategory: "calefaccion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.6,
    reviews: 18,
    tags: ["lámpara", "cerámica", "calor", "nocturna"]
  },
  {
    name: "Manta Térmica Regulable",
    description: "Manta calefactora con termostato integrado para mantener temperatura constante.",
    price: 45990,
    category: "reptiles",
    subcategory: "calefaccion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.8,
    reviews: 24,
    tags: ["manta", "térmica", "regulable", "termostato"]
  },
  {
    name: "Piedra Calefactora Natural",
    description: "Piedra calefactora que simula rocas naturales para el basking de reptiles.",
    price: 28990,
    category: "reptiles",
    subcategory: "calefaccion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 32,
    rating: 4.4,
    reviews: 16,
    tags: ["piedra", "calefactora", "natural", "basking"]
  },

  // REPTILES - Iluminación (3 productos)
  {
    name: "Lámpara UVB 10.0 Compacta",
    description: "Lámpara UVB esencial para la síntesis de vitamina D3 en reptiles diurnos.",
    price: 42990,
    category: "reptiles",
    subcategory: "iluminacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 22,
    rating: 4.9,
    reviews: 28,
    tags: ["lámpara", "UVB", "vitamina D3", "diurnos"]
  },
  {
    name: "LED Full Spectrum para Plantas",
    description: "Iluminación LED que favorece el crecimiento de plantas vivas en terrarios bioactivos.",
    price: 67990,
    category: "reptiles",
    subcategory: "iluminacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.7,
    reviews: 19,
    tags: ["LED", "full spectrum", "plantas", "bioactivo"]
  },
  {
    name: "Lámpara de Basking Halógena",
    description: "Lámpara halógena de alta intensidad para crear puntos de calor localizados.",
    price: 24990,
    category: "reptiles",
    subcategory: "iluminacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 28,
    rating: 4.5,
    reviews: 21,
    tags: ["lámpara", "basking", "halógena", "intensidad"]
  },

  // ANFIBIOS - Bebederos y Comederos (3 productos)
  {
    name: "Comedero Flotante para Anfibios",
    description: "Comedero que flota en el agua, ideal para especies acuáticas y semi-acuáticas.",
    price: 28990,
    category: "anfibios",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.6,
    reviews: 19,
    tags: ["comedero", "flotante", "acuáticas", "semi-acuáticas"]
  },
  {
    name: "Plato de Agua Poco Profundo",
    description: "Recipiente de agua con bordes bajos, perfecto para ranas y salamandras.",
    price: 15990,
    category: "anfibios",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 40,
    rating: 4.5,
    reviews: 32,
    tags: ["plato", "agua", "poco profundo", "ranas"]
  },
  {
    name: "Sistema de Goteo Continuo",
    description: "Dispensador de agua que mantiene un flujo constante para estimular la bebida.",
    price: 45990,
    category: "anfibios",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.7,
    reviews: 15,
    tags: ["goteo", "continuo", "flujo", "estimular"]
  },

  // ANFIBIOS - Escondites (3 productos)
  {
    name: "Cueva de Musgo Natural",
    description: "Refugio cubierto de musgo natural que mantiene la humedad.",
    price: 34990,
    category: "anfibios",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 30,
    rating: 4.8,
    reviews: 24,
    tags: ["cueva", "musgo", "natural", "humedad"]
  },
  {
    name: "Tronco Hueco Sumergible",
    description: "Escondite que puede usarse tanto en tierra como sumergido en agua.",
    price: 42990,
    category: "anfibios",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.7,
    reviews: 21,
    tags: ["tronco", "hueco", "sumergible", "versátil"]
  },
  {
    name: "Refugio de Corteza Húmeda",
    description: "Escondite hecho con corteza que retiene humedad naturalmente.",
    price: 26990,
    category: "anfibios",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 35,
    rating: 4.6,
    reviews: 28,
    tags: ["refugio", "corteza", "húmeda", "natural"]
  },

  // ANFIBIOS - Sustratos (3 productos)
  {
    name: "Sustrato de Turba Tropical",
    description: "Sustrato natural que mantiene alta humedad, ideal para anfibios tropicales.",
    price: 22990,
    category: "anfibios",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 45,
    rating: 4.8,
    reviews: 36,
    tags: ["sustrato", "turba", "tropical", "humedad"]
  },
  {
    name: "Musgo Sphagnum Vivo",
    description: "Musgo vivo que purifica el aire y mantiene condiciones húmedas ideales.",
    price: 18990,
    category: "anfibios",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 50,
    rating: 4.9,
    reviews: 42,
    tags: ["musgo", "sphagnum", "vivo", "purifica"]
  },
  {
    name: "Grava de Río Lavada",
    description: "Grava natural de río, perfecta para áreas acuáticas en terrarios de anfibios.",
    price: 16990,
    category: "anfibios",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 60,
    rating: 4.5,
    reviews: 29,
    tags: ["grava", "río", "lavada", "acuáticas"]
  },

  // ANFIBIOS - Alimentación (3 productos)
  {
    name: "Pellets para Ranas Acuáticas",
    description: "Alimento flotante específicamente formulado para ranas acuáticas.",
    price: 24990,
    category: "anfibios",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 35,
    rating: 4.7,
    reviews: 28,
    tags: ["pellets", "ranas", "acuáticas", "flotante"]
  },
  {
    name: "Gusanos de Sangre Liofilizados",
    description: "Alimento rico en proteínas, ideal para anfibios carnívoros.",
    price: 19990,
    category: "anfibios",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 40,
    rating: 4.8,
    reviews: 33,
    tags: ["gusanos", "sangre", "liofilizados", "proteínas"]
  },
  {
    name: "Suplemento de Calcio Líquido",
    description: "Suplemento líquido de calcio que se puede agregar al agua o alimento.",
    price: 16990,
    category: "anfibios",
    subcategory: "alimentacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 55,
    rating: 4.6,
    reviews: 25,
    tags: ["suplemento", "calcio", "líquido", "agua"]
  },

  // ANFIBIOS - Iluminación (3 productos)
  {
    name: "Lámpara UVB para Anfibios",
    description: "Iluminación UVB específica para anfibios que necesitan exposición controlada.",
    price: 67990,
    category: "anfibios",
    subcategory: "iluminacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.8,
    reviews: 18,
    tags: ["lámpara", "UVB", "anfibios", "controlada"]
  },
  {
    name: "LED de Espectro Completo",
    description: "Iluminación LED que simula la luz natural del día para terrarios plantados.",
    price: 89990,
    category: "anfibios",
    subcategory: "iluminacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.9,
    reviews: 22,
    tags: ["LED", "espectro", "completo", "plantados"]
  },
  {
    name: "Luz Nocturna Roja",
    description: "Iluminación nocturna que no interfiere con los ciclos naturales de los anfibios.",
    price: 32990,
    category: "anfibios",
    subcategory: "iluminacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 30,
    rating: 4.5,
    reviews: 16,
    tags: ["luz", "nocturna", "roja", "ciclos"]
  },

  // ANFIBIOS - Calefacción (3 productos)
  {
    name: "Calentador Sumergible Ajustable",
    description: "Calentador de agua sumergible con control de temperatura preciso.",
    price: 45990,
    category: "anfibios",
    subcategory: "calefaccion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.7,
    reviews: 20,
    tags: ["calentador", "sumergible", "ajustable", "preciso"]
  },
  {
    name: "Manta Térmica de Baja Potencia",
    description: "Manta calefactora suave ideal para anfibios sensibles al calor.",
    price: 38990,
    category: "anfibios",
    subcategory: "calefaccion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 22,
    rating: 4.6,
    reviews: 17,
    tags: ["manta", "térmica", "baja potencia", "sensibles"]
  },
  {
    name: "Cable Calefactor Flexible",
    description: "Cable calefactor que se puede colocar bajo el sustrato para calor de fondo.",
    price: 52990,
    category: "anfibios",
    subcategory: "calefaccion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.8,
    reviews: 14,
    tags: ["cable", "calefactor", "flexible", "sustrato"]
  },

  // ANFIBIOS - Termostatos (3 productos)
  {
    name: "Termostato Digital para Anfibios",
    description: "Controlador de temperatura específico para las necesidades de anfibios.",
    price: 78990,
    category: "anfibios",
    subcategory: "termostatos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.8,
    reviews: 15,
    tags: ["termostato", "digital", "anfibios", "específico"]
  },
  {
    name: "Controlador de Humedad y Temperatura",
    description: "Sistema dual que controla tanto temperatura como humedad automáticamente.",
    price: 124990,
    category: "anfibios",
    subcategory: "termostatos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.9,
    reviews: 11,
    tags: ["controlador", "humedad", "temperatura", "dual"]
  },
  {
    name: "Termostato Básico Resistente al Agua",
    description: "Controlador simple y resistente al agua para ambientes húmedos.",
    price: 56990,
    category: "anfibios",
    subcategory: "termostatos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.6,
    reviews: 19,
    tags: ["termostato", "básico", "resistente", "húmedos"]
  },

  // ANFIBIOS - Acuaterrarios (3 productos)
  {
    name: "Acuaterrario Paludario 80L",
    description: "Acuaterrario con sección acuática y terrestre, perfecto para salamandras y tritones.",
    price: 189990,
    category: "anfibios",
    subcategory: "acuaterrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 8,
    rating: 4.8,
    reviews: 12,
    tags: ["acuaterrario", "paludario", "salamandras", "tritones"]
  },
  {
    name: "Terrario Húmedo para Ranas",
    description: "Terrario con sistema de nebulización automática para mantener humedad alta.",
    price: 149990,
    category: "anfibios",
    subcategory: "acuaterrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 10,
    rating: 4.7,
    reviews: 16,
    tags: ["terrario", "húmedo", "ranas", "nebulización"]
  },
  {
    name: "Acuario Especializado para Axolotl",
    description: "Acuario con filtración especializada y temperatura controlada para axolotls.",
    price: 234990,
    category: "anfibios",
    subcategory: "acuaterrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 6,
    rating: 4.9,
    reviews: 9,
    tags: ["acuario", "axolotl", "filtración", "temperatura"]
  },

  // ANFIBIOS - Humidificación (3 productos)
  {
    name: "Sistema de Nebulización Automático",
    description: "Sistema completo de nebulización con temporizador para mantener humedad óptima.",
    price: 89990,
    category: "anfibios",
    subcategory: "humidificacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.8,
    reviews: 14,
    tags: ["nebulización", "automático", "temporizador", "humedad"]
  },
  {
    name: "Humidificador Ultrasónico",
    description: "Humidificador silencioso que genera niebla fina para ambientes tropicales.",
    price: 54990,
    category: "anfibios",
    subcategory: "humidificacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.6,
    reviews: 22,
    tags: ["humidificador", "ultrasónico", "silencioso", "tropical"]
  },
  {
    name: "Gotero de Lluvia Artificial",
    description: "Sistema de goteo que simula lluvia natural para estimular comportamientos naturales.",
    price: 32990,
    category: "anfibios",
    subcategory: "humidificacion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.4,
    reviews: 18,
    tags: ["gotero", "lluvia", "artificial", "natural"]
  },

  // ANFIBIOS - Filtración (3 productos)
  {
    name: "Filtro Canister Silencioso",
    description: "Filtro externo de alta capacidad con múltiples etapas de filtración.",
    price: 124990,
    category: "anfibios",
    subcategory: "filtracion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 10,
    rating: 4.9,
    reviews: 16,
    tags: ["filtro", "canister", "silencioso", "capacidad"]
  },
  {
    name: "Filtro de Cascada Compacto",
    description: "Filtro colgante que crea una cascada natural mientras filtra el agua.",
    price: 67990,
    category: "anfibios",
    subcategory: "filtracion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.6,
    reviews: 20,
    tags: ["filtro", "cascada", "compacto", "natural"]
  },
  {
    name: "Filtro Biológico de Esponja",
    description: "Filtro suave ideal para anfibios jóvenes y especies delicadas.",
    price: 24990,
    category: "anfibios",
    subcategory: "filtracion",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 28,
    rating: 4.5,
    reviews: 24,
    tags: ["filtro", "biológico", "esponja", "delicadas"]
  },

  // PECES - Acuarios (3 productos)
  {
    name: "Acuario Curvo 200L con Mueble",
    description: "Acuario panorámico con cristal curvo y mueble a juego, incluye iluminación LED.",
    price: 449990,
    category: "peces",
    subcategory: "acuarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 5,
    rating: 4.9,
    reviews: 18,
    tags: ["acuario", "curvo", "panorámico", "LED"]
  },
  {
    name: "Nano Acuario 30L Completo",
    description: "Acuario compacto ideal para principiantes, incluye filtro, calentador y luz.",
    price: 89990,
    category: "peces",
    subcategory: "acuarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.6,
    reviews: 32,
    tags: ["nano", "acuario", "completo", "principiantes"]
  },
  {
    name: "Acuario Marino 300L Profesional",
    description: "Sistema completo para acuariofilia marina con sump y skimmer incluidos.",
    price: 899990,
    category: "peces",
    subcategory: "acuarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 3,
    rating: 4.8,
    reviews: 12,
    tags: ["acuario", "marino", "profesional", "sump"]
  },

  // PECES - Filtros (3 productos)
  {
    name: "Filtro Externo 1200L/h",
    description: "Filtro canister de alta eficiencia con medios filtrantes incluidos.",
    price: 189990,
    category: "peces",
    subcategory: "filtros",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.8,
    reviews: 25,
    tags: ["filtro", "externo", "eficiencia", "canister"]
  },
  {
    name: "Filtro Interno con UV",
    description: "Filtro sumergible con lámpara UV integrada para eliminar algas y bacterias.",
    price: 124990,
    category: "peces",
    subcategory: "filtros",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 18,
    rating: 4.7,
    reviews: 21,
    tags: ["filtro", "interno", "UV", "bacterias"]
  },
  {
    name: "Filtro de Mochila Ajustable",
    description: "Filtro colgante con caudal ajustable, perfecto para acuarios medianos.",
    price: 67990,
    category: "peces",
    subcategory: "filtros",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 22,
    rating: 4.5,
    reviews: 28,
    tags: ["filtro", "mochila", "ajustable", "medianos"]
  },

  // PECES - Calentadores (3 productos)
  {
    name: "Calentador Digital Programable 300W",
    description: "Calentador con display digital y control preciso de temperatura.",
    price: 89990,
    category: "peces",
    subcategory: "calentadores",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 19,
    tags: ["calentador", "digital", "programable", "preciso"]
  },
  {
    name: "Calentador Sumergible 150W",
    description: "Calentador resistente con termostato automático y protección contra sobrecalentamiento.",
    price: 45990,
    category: "peces",
    subcategory: "calentadores",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.6,
    reviews: 24,
    tags: ["calentador", "sumergible", "termostato", "protección"]
  },
  {
    name: "Calentador de Sustrato 25W",
    description: "Cable calefactor para colocar bajo el sustrato, ideal para plantas acuáticas.",
    price: 32990,
    category: "peces",
    subcategory: "calentadores",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.4,
    reviews: 16,
    tags: ["calentador", "sustrato", "cable", "plantas"]
  },

  // ARÁCNIDOS - Terrarios (3 productos)
  {
    name: "Terrario para Tarántulas 40x30x30",
    description: "Terrario especializado con ventilación lateral y tapa de malla fina para tarántulas.",
    price: 89990,
    category: "aracnidos",
    subcategory: "terrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 12,
    rating: 4.7,
    reviews: 15,
    tags: ["terrario", "tarántulas", "ventilación", "malla"]
  },
  {
    name: "Terrario Vertical para Arbóreas",
    description: "Terrario alto con múltiples niveles para especies arbóreas como Avicularia.",
    price: 124990,
    category: "aracnidos",
    subcategory: "terrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 8,
    rating: 4.8,
    reviews: 11,
    tags: ["terrario", "vertical", "arbóreas", "niveles"]
  },
  {
    name: "Terrario Compacto para Juveniles",
    description: "Terrario pequeño ideal para crías y juveniles de arácnidos.",
    price: 34990,
    category: "aracnidos",
    subcategory: "terrarios",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    rating: 4.5,
    reviews: 18,
    tags: ["terrario", "compacto", "juveniles", "crías"]
  },

  // ARÁCNIDOS - Sustratos (3 productos)
  {
    name: "Fibra de Coco Premium",
    description: "Sustrato natural de fibra de coco, ideal para mantener humedad en especies tropicales.",
    price: 18990,
    category: "aracnidos",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 35,
    rating: 4.6,
    reviews: 22,
    tags: ["fibra", "coco", "natural", "humedad"]
  },
  {
    name: "Vermiculita Expandida",
    description: "Sustrato mineral que retiene humedad, perfecto para especies que requieren alta humedad.",
    price: 24990,
    category: "aracnidos",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 28,
    rating: 4.7,
    reviews: 19,
    tags: ["vermiculita", "mineral", "retiene", "humedad"]
  },
  {
    name: "Turba Rubia Natural",
    description: "Sustrato ácido natural que mantiene la humedad y previene hongos.",
    price: 21990,
    category: "aracnidos",
    subcategory: "sustratos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 25,
    rating: 4.4,
    reviews: 16,
    tags: ["turba", "rubia", "ácido", "hongos"]
  },

  // ARÁCNIDOS - Bebederos (3 productos)
  {
    name: "Bebedero Pequeño de Cerámica",
    description: "Bebedero de cerámica pesado que no se vuelca, ideal para tarántulas terrestres.",
    price: 12990,
    category: "aracnidos",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 45,
    rating: 4.5,
    reviews: 28,
    tags: ["bebedero", "cerámica", "pesado", "terrestres"]
  },
  {
    name: "Plato de Agua con Textura",
    description: "Bebedero con superficie texturizada que facilita el acceso al agua.",
    price: 8990,
    category: "aracnidos",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 52,
    rating: 4.3,
    reviews: 31,
    tags: ["plato", "agua", "textura", "acceso"]
  },
  {
    name: "Bebedero Magnético Removible",
    description: "Bebedero que se adhiere magnéticamente al vidrio para fácil limpieza.",
    price: 16990,
    category: "aracnidos",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 38,
    rating: 4.6,
    reviews: 24,
    tags: ["bebedero", "magnético", "removible", "limpieza"]
  }
];

const seedProducts = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar productos existentes
    await Product.deleteMany({});
    console.log('🗑️ Productos existentes eliminados');

    // Insertar nuevos productos
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} productos creados exitosamente`);

    // Mostrar resumen por categoría
    const categoryCount = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Resumen por categoría:');
    categoryCount.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} productos`);
    });

    console.log('\n🎉 Base de datos poblada exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar script
seedProducts();