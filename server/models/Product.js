import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['aves', 'reptiles', 'mamiferos-pequenos', 'peces', 'aracnidos', 'anfibios']
  },
  subcategory: {
    type: String,
    required: [true, 'La subcategoría es requerida'],
    enum: ['escondites', 'comederos', 'bebederos', 'juguetes', 'camas', 'accesorios']
  },
  image: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  rating: {
    type: Number,
    min: [0, 'La calificación mínima es 0'],
    max: [5, 'La calificación máxima es 5'],
    default: 0
  },
  reviews: {
    type: Number,
    min: [0, 'Las reseñas no pueden ser negativas'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    material: String,
    dimensions: String,
    weight: String,
    color: String,
    brand: String
  }
}, {
  timestamps: true
});

// Índice de texto para búsqueda
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Índices para filtros
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// Método virtual para URL amigable
productSchema.virtual('slug').get(function() {
  return this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
});

// Método para verificar disponibilidad
productSchema.methods.isAvailable = function(quantity = 1) {
  return this.isActive && this.stock >= quantity;
};

// Método para reducir stock
productSchema.methods.reduceStock = function(quantity) {
  if (this.stock >= quantity) {
    this.stock -= quantity;
    return true;
  }
  return false;
};

const Product = mongoose.model('Product', productSchema);

export default Product;