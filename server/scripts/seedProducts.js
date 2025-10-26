import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  // AVES
  {
    name: "Jaula Hexagonal Premium para Aves",
    description: "Jaula espaciosa de acero inoxidable con múltiples perchas y comederos integrados. Ideal para canarios, periquitos y aves pequeñas.",
    price: 89990,
    category: "aves",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 24,
    tags: ["jaula", "aves", "premium", "acero"],
    specifications: {
      material: "Acero inoxidable",
      dimensions: "60x40x80 cm",
      weight: "8.5 kg",
      color: "Negro mate",
      brand: "ExoPet Pro"
    }
  },
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
    tags: ["comedero", "anti-desperdicio", "doble"],
    specifications: {
      material: "Acero inoxidable y plástico ABS",
      dimensions: "25x15x8 cm",
      weight: "0.8 kg",
      color: "Plateado",
      brand: "ExoPet"
    }
  },
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
    tags: ["bebedero", "automático", "filtro"],
    specifications: {
      material: "Plástico libre de BPA",
      dimensions: "20x15x25 cm",
      weight: "1.2 kg",
      color: "Transparente",
      brand: "ExoPet Pro"
    }
  },

  // REPTILES
  {
    name: "Terrario de Vidrio con Ventilación",
    description: "Terrario profesional con sistema de ventilación frontal y lateral. Ideal para reptiles tropicales.",
    price: 159990,
    category: "reptiles",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 8,
    rating: 4.9,
    reviews: 12,
    tags: ["terrario", "vidrio", "ventilación", "tropical"],
    specifications: {
      material: "Vidrio templado y aluminio",
      dimensions: "90x45x60 cm",
      weight: "25 kg",
      color: "Negro",
      brand: "ExoPet Pro"
    }
  },
  {
    name: "Cueva de Resina Natural",
    description: "Escondite realista hecho de resina que imita piedra natural. Perfecto para geckos y serpientes pequeñas.",
    price: 18990,
    category: "reptiles",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400",
    stock: 45,
    rating: 4.5,
    reviews: 31,
    tags: ["cueva", "resina", "natural", "escondite"],
    specifications: {
      material: "Resina polimérica",
      dimensions: "15x12x8 cm",
      weight: "0.6 kg",
      color: "Piedra natural",
      brand: "ExoPet"
    }
  },
  {
    name: "Lámpara UVB 10.0 con Timer",
    description: "Lámpara especializada con rayos UVB esenciales para la salud de reptiles. Incluye temporizador digital.",
    price: 67990,
    category: "reptiles",
    subcategory: "accesorios",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 22,
    rating: 4.8,
    reviews: 19,
    tags: ["lámpara", "UVB", "timer", "salud"],
    specifications: {
      material: "Aluminio y vidrio",
      dimensions: "30x15x12 cm",
      weight: "1.8 kg",
      color: "Negro",
      brand: "ExoPet Pro"
    }
  },

  // MAMÍFEROS PEQUEÑOS
  {
    name: "Jaula Multi-Nivel para Hurones",
    description: "Jaula de tres niveles con rampas, hamacas y múltiples áreas de juego. Ideal para hurones y chinchillas.",
    price: 199990,
    category: "mamiferos-pequenos",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400",
    stock: 6,
    rating: 4.9,
    reviews: 8,
    tags: ["jaula", "multi-nivel", "hurones", "chinchillas"],
    specifications: {
      material: "Acero recubierto en polvo",
      dimensions: "120x60x180 cm",
      weight: "45 kg",
      color: "Negro",
      brand: "ExoPet Pro"
    }
  },
  {
    name: "Hamaca Colgante de Felpa",
    description: "Hamaca súper suave y cómoda para el descanso de pequeños mamíferos. Fácil de lavar y instalar.",
    price: 12990,
    category: "mamiferos-pequenos",
    subcategory: "camas",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400",
    stock: 67,
    rating: 4.4,
    reviews: 42,
    tags: ["hamaca", "felpa", "cómoda", "lavable"],
    specifications: {
      material: "Felpa y algodón",
      dimensions: "30x25x5 cm",
      weight: "0.3 kg",
      color: "Gris",
      brand: "ExoPet"
    }
  },
  {
    name: "Túnel de Juego Extensible",
    description: "Túnel flexible y extensible que proporciona horas de diversión y ejercicio para roedores pequeños.",
    price: 16990,
    category: "mamiferos-pequenos",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400",
    stock: 38,
    rating: 4.6,
    reviews: 25,
    tags: ["túnel", "juego", "extensible", "ejercicio"],
    specifications: {
      material: "Nylon resistente",
      dimensions: "60-120x25 cm (extensible)",
      weight: "0.8 kg",
      color: "Azul y gris",
      brand: "ExoPet"
    }
  },

  // PECES
  {
    name: "Acuario Curvo de 200L con LED",
    description: "Acuario panorámico con iluminación LED de espectro completo y sistema de filtración integrado.",
    price: 299990,
    category: "peces",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    stock: 4,
    rating: 4.9,
    reviews: 6,
    tags: ["acuario", "LED", "curvo", "filtración"],
    specifications: {
      material: "Vidrio curvado y acero",
      dimensions: "100x40x50 cm",
      weight: "35 kg",
      color: "Negro",
      brand: "ExoPet Pro"
    }
  },
  {
    name: "Comedero Automático Programable",
    description: "Dispensador automático de alimento con hasta 4 comidas diarias programables. Ideal para viajes.",
    price: 45990,
    category: "peces",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    stock: 19,
    rating: 4.7,
    reviews: 14,
    tags: ["comedero", "automático", "programable", "viajes"],
    specifications: {
      material: "Plástico ABS",
      dimensions: "15x12x20 cm",
      weight: "1.1 kg",
      color: "Blanco",
      brand: "ExoPet Pro"
    }
  },
  {
    name: "Decoración de Coral Artificial",
    description: "Réplica realista de coral que proporciona refugio y belleza natural al acuario.",
    price: 22990,
    category: "peces",
    subcategory: "accesorios",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    stock: 33,
    rating: 4.5,
    reviews: 21,
    tags: ["coral", "artificial", "decoración", "refugio"],
    specifications: {
      material: "Resina segura para acuarios",
      dimensions: "25x20x18 cm",
      weight: "1.5 kg",
      color: "Coral natural",
      brand: "ExoPet"
    }
  },

  // ARÁCNIDOS
  {
    name: "Terrario Especializado para Tarántulas",
    description: "Terrario horizontal con ventilación superior y acceso frontal. Diseñado específicamente para arácnidos.",
    price: 89990,
    category: "aracnidos",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 12,
    rating: 4.8,
    reviews: 9,
    tags: ["terrario", "tarántulas", "horizontal", "especializado"],
    specifications: {
      material: "Vidrio y malla metálica",
      dimensions: "40x30x20 cm",
      weight: "8 kg",
      color: "Negro",
      brand: "ExoPet Pro"
    }
  },
  {
    name: "Escondite de Corteza Natural",
    description: "Refugio natural hecho de corteza auténtica, perfecto para crear un ambiente realista.",
    price: 14990,
    category: "aracnidos",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 28,
    rating: 4.6,
    reviews: 16,
    tags: ["corteza", "natural", "refugio", "auténtico"],
    specifications: {
      material: "Corteza natural tratada",
      dimensions: "12x8x6 cm",
      weight: "0.2 kg",
      color: "Marrón natural",
      brand: "ExoPet"
    }
  },

  // ANFIBIOS
  {
    name: "Paludario con Cascada Integrada",
    description: "Ecosistema acuático-terrestre con cascada funcional y áreas de tierra y agua separadas.",
    price: 249990,
    category: "anfibios",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 3,
    rating: 5.0,
    reviews: 4,
    tags: ["paludario", "cascada", "ecosistema", "acuático-terrestre"],
    specifications: {
      material: "Vidrio y bomba de agua",
      dimensions: "80x40x60 cm",
      weight: "28 kg",
      color: "Transparente",
      brand: "ExoPet Pro"
    }
  },
  {
    name: "Musgo Vivo Preservado",
    description: "Musgo natural preservado que mantiene la humedad y crea un ambiente tropical auténtico.",
    price: 19990,
    category: "anfibios",
    subcategory: "accesorios",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 25,
    rating: 4.7,
    reviews: 11,
    tags: ["musgo", "vivo", "preservado", "humedad"],
    specifications: {
      material: "Musgo natural preservado",
      dimensions: "30x20x5 cm",
      weight: "0.5 kg",
      color: "Verde natural",
      brand: "ExoPet"
    }
  },
  {
    name: "Sustrato Húmedo Especializado",
    description: "Mezcla de turba y fibra de coco que mantiene la humedad ideal para anfibios tropicales.",
    price: 16990,
    category: "anfibios",
    subcategory: "accesorios",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    stock: 41,
    rating: 4.5,
    reviews: 18,
    tags: ["sustrato", "húmedo", "turba", "fibra-coco"],
    specifications: {
      material: "Turba y fibra de coco",
      dimensions: "40x30x10 cm (comprimido)",
      weight: "2.5 kg",
      color: "Marrón oscuro",
      brand: "ExoPet"
    }
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