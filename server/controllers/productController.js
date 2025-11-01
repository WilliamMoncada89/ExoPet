import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Obtener todos los productos con filtros y paginación
export const getAllProducts = catchAsync(async (req, res, next) => {
  console.log('🔍 getAllProducts llamado con query:', req.query);
  
  const {
    page = 1,
    limit = 12,
    category,
    subcategory,
    minPrice,
    maxPrice,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Construir filtros
  const filter = { isActive: true };
  
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  
  if (search) {
    filter.$text = { $search: search };
  }

  // Configurar ordenamiento
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Ejecutar consulta con paginación
  const skip = (page - 1) * limit;
  
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter)
  ]);

  console.log('📊 getAllProducts: Productos encontrados:', products.length, 'Total:', total);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// Obtener producto por ID
export const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const product = await Product.findById(id);
  
  if (!product || !product.isActive) {
    return next(new AppError('Producto no encontrado', 404));
  }

  res.status(200).json({
    success: true,
    data: { product }
  });
});

// Obtener productos por categoría
export const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { limit = 8, subcategory } = req.query;

  const filter = { category, isActive: true };
  if (subcategory) filter.subcategory = subcategory;

  const products = await Product.find(filter)
    .sort({ rating: -1, createdAt: -1 })
    .limit(Number(limit))
    .lean();

  res.status(200).json({
    success: true,
    data: { products }
  });
});

// Obtener productos destacados
export const getFeaturedProducts = catchAsync(async (req, res, next) => {
  const { limit = 6 } = req.query;

  const products = await Product.find({ 
    isActive: true,
    rating: { $gte: 4 }
  })
    .sort({ rating: -1, reviews: -1 })
    .limit(Number(limit))
    .lean();

  res.status(200).json({
    success: true,
    data: { products }
  });
});

// Buscar productos
export const searchProducts = catchAsync(async (req, res, next) => {
  const { q, limit = 10 } = req.query;
  
  if (!q) {
    return next(new AppError('Término de búsqueda requerido', 400));
  }

  const products = await Product.find({
    $text: { $search: q },
    isActive: true
  })
    .sort({ score: { $meta: 'textScore' } })
    .limit(Number(limit))
    .lean();

  res.status(200).json({
    success: true,
    data: { products }
  });
});

// Obtener categorías disponibles
export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        subcategories: { $addToSet: '$subcategory' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const categoryMap = {
    'aves': { name: 'Aves', icon: '🦜', description: 'Accesorios para aves exóticas' },
    'reptiles': { name: 'Reptiles', icon: '🦎', description: 'Accesorios para reptiles' },
    'mamiferos': { name: 'Mamíferos', icon: '🐹', description: 'Accesorios para mamíferos pequeños' },
    'peces': { name: 'Peces', icon: '🐠', description: 'Accesorios para peces exóticos' },
    'aracnidos': { name: 'Arácnidos', icon: '🕷️', description: 'Accesorios para arácnidos' },
    'anfibios': { name: 'Anfibios', icon: '🐸', description: 'Accesorios para anfibios' }
  };

  const formattedCategories = categories.map(cat => ({
    id: cat._id,
    ...categoryMap[cat._id],
    productCount: cat.count,
    subcategories: cat.subcategories.sort()
  }));

  res.status(200).json({
    success: true,
    data: { categories: formattedCategories }
  });
});

// Crear producto (Admin)
export const createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: { product }
  });
});

// Actualizar producto (Admin)
export const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const product = await Product.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new AppError('Producto no encontrado', 404));
  }

  res.status(200).json({
    success: true,
    data: { product }
  });
});

// Eliminar producto (Admin)
export const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    return next(new AppError('Producto no encontrado', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Producto eliminado correctamente'
  });
});

// Verificar disponibilidad de stock
export const checkStock = catchAsync(async (req, res, next) => {
  const { items } = req.body; // Array de { productId, quantity }
  
  console.log('🔍 CheckStock - Items recibidos:', JSON.stringify(items, null, 2));
  
  const stockCheck = await Promise.all(
    items.map(async (item) => {
      console.log(`🔍 Buscando producto con ID: ${item.productId}`);
      const product = await Product.findById(item.productId);
      console.log(`🔍 Producto encontrado:`, product ? `${product.name} - Stock: ${product.stock}` : 'No encontrado');
      
      return {
        productId: item.productId,
        requestedQuantity: item.quantity,
        availableStock: product ? product.stock : 0,
        isAvailable: product ? product.isAvailable(item.quantity) : false
      };
    })
  );

  const allAvailable = stockCheck.every(item => item.isAvailable);
  
  console.log('🔍 CheckStock - Resultado:', JSON.stringify(stockCheck, null, 2));

  res.status(200).json({
    success: true,
    data: {
      allAvailable,
      items: stockCheck
    }
  });
});