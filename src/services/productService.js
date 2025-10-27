import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Configuración de axios para productos
const productAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación si existe
productAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Mock data para desarrollo - Accesorios para Animales Exóticos
const mockProducts = [
  // AVES
  {
    id: 1,
    name: "Jaula Espaciosa para Loros",
    description: "Jaula de acero inoxidable con múltiples perchas y comederos",
    price: 189990,
    category: "aves",
    subcategory: "escondites",
    image: "/images/products/aves/jaula-loros.svg",
    stock: 5,
    featured: true,
    rating: 4.8,
    reviews: 15,
    animalType: "aves"
  },
  {
    id: 2,
    name: "Comedero Anti-Desperdicio para Aves",
    description: "Comedero con sistema anti-derrame para semillas y pellets",
    price: 24990,
    category: "aves",
    subcategory: "comederos",
    image: "/images/products/aves/comedero-aves.svg",
    stock: 12,
    featured: true,
    rating: 4.6,
    reviews: 28
  },
  {
    id: 3,
    name: "Bebedero Automático para Aves",
    description: "Sistema de hidratación continua con filtro incorporado",
    price: 32990,
    category: "aves",
    subcategory: "bebederos",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
    stock: 8,
    featured: false,
    rating: 4.4,
    reviews: 12
  },
  {
    id: 4,
    name: "Juguete Colgante para Loros",
    description: "Juguete interactivo con campanas y cuerdas naturales",
    price: 18990,
    category: "aves",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 15,
    featured: true,
    rating: 4.7,
    reviews: 22
  },

  // REPTILES
  {
    id: 5,
    name: "Terrario de Vidrio 120x60x60",
    description: "Terrario con ventilación superior y puertas frontales",
    price: 299990,
    category: "reptiles",
    subcategory: "escondites",
    image: "/images/products/reptiles/terrario-vidrio.svg",
    stock: 3,
    featured: true,
    rating: 4.9,
    reviews: 8
  },
  {
    id: 6,
    name: "Cueva de Resina para Reptiles",
    description: "Escondite natural con múltiples entradas y salidas",
    price: 45990,
    category: "reptiles",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    stock: 10,
    featured: false,
    rating: 4.5,
    reviews: 18
  },
  {
    id: 7,
    name: "Lámpara de Calor UVB",
    description: "Sistema de iluminación y calefacción para reptiles",
    price: 67990,
    category: "reptiles",
    subcategory: "accesorios",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
    stock: 7,
    featured: true,
    rating: 4.8,
    reviews: 14
  },
  {
    id: 8,
    name: "Comedero de Cerámica para Reptiles",
    description: "Plato pesado anti-volcamiento con superficie lisa",
    price: 16990,
    category: "reptiles",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 20,
    featured: false,
    rating: 4.3,
    reviews: 25
  },

  // MAMÍFEROS PEQUEÑOS
  {
    id: 9,
    name: "Jaula Multi-Nivel para Hurones",
    description: "Jaula de 3 pisos con rampas y plataformas",
    price: 234990,
    category: "mamiferos",
    subcategory: "escondites",
    image: "/images/products/mamiferos/jaula-hurones.svg",
    stock: 4,
    featured: true,
    rating: 4.7,
    reviews: 11
  },
  {
    id: 10,
    name: "Hamaca Colgante para Hurones",
    description: "Cama suave y cómoda que se cuelga en la jaula",
    price: 28990,
    category: "mamiferos",
    subcategory: "camas",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 12,
    featured: false,
    rating: 4.6,
    reviews: 19
  },
  {
    id: 11,
    name: "Túnel de Juego para Conejos",
    description: "Túnel plegable para ejercicio y entretenimiento",
    price: 35990,
    category: "mamiferos",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400",
    stock: 8,
    featured: true,
    rating: 4.4,
    reviews: 16
  },

  // PECES
  {
    id: 12,
    name: "Acuario Curvo 200L con Filtro",
    description: "Acuario completo con sistema de filtración y LED",
    price: 389990,
    category: "peces",
    subcategory: "escondites",
    image: "/images/products/peces/acuario-curvo.svg",
    stock: 2,
    featured: true,
    rating: 4.9,
    reviews: 7
  },
  {
    id: 13,
    name: "Comedero Automático para Peces",
    description: "Dispensador programable de alimento para peces",
    price: 89990,
    category: "peces",
    subcategory: "comederos",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    stock: 6,
    featured: false,
    rating: 4.5,
    reviews: 13
  },
  {
    id: 14,
    name: "Decoración de Coral Artificial",
    description: "Ornamento realista para acuarios marinos y dulces",
    price: 24990,
    category: "peces",
    subcategory: "juguetes",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    stock: 15,
    featured: false,
    rating: 4.2,
    reviews: 21
  },

  // ARÁCNIDOS
  {
    id: 15,
    name: "Terrario para Tarántulas 30x30x30",
    description: "Terrario especializado con ventilación lateral",
    price: 89990,
    category: "aracnidos",
    subcategory: "escondites",
    image: "/images/products/aracnidos/terrario-tarantulas.svg",
    stock: 5,
    featured: true,
    rating: 4.6,
    reviews: 9
  },
  {
    id: 16,
    name: "Escondite de Corteza para Arañas",
    description: "Refugio natural de corteza tratada",
    price: 19990,
    category: "aracnidos",
    subcategory: "escondites",
    image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400",
    stock: 18,
    featured: false,
    rating: 4.3,
    reviews: 12
  },

  // ANFIBIOS
  {
    id: 17,
    name: "Paludario para Ranas 60x45x60",
    description: "Hábitat semi-acuático con cascada incorporada",
    price: 279990,
    category: "anfibios",
    subcategory: "escondites",
    image: "/images/products/anfibios/paludario-ranas.svg",
    stock: 3,
    featured: true,
    rating: 4.8,
    reviews: 6
  },
  {
    id: 18,
    name: "Musgo Vivo para Anfibios",
    description: "Sustrato natural que mantiene la humedad",
    price: 22990,
    category: "anfibios",
    subcategory: "accesorios",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    stock: 12,
    featured: false,
    rating: 4.4,
    reviews: 15
  }
]

// Funciones del servicio de productos
// Obtener productos por categoría
export const getProductsByCategory = async (category) => {
  try {
    // En producción, esto sería una llamada a la API
    // const response = await api.get(`/products/category/${category}`);
    // return response.data;
    
    // Mock data
    const filteredProducts = mockProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
    
    return {
      success: true,
      data: filteredProducts,
      total: filteredProducts.length
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return {
      success: false,
      error: 'Error al obtener productos por categoría'
    };
  }
};

export const productService = {
  // Obtener todos los productos con filtros opcionales
  getAllProducts: async (filters = {}) => {
    try {
      // En desarrollo, usar datos mock
      if (import.meta.env.DEV) {
        let filteredProducts = [...mockProducts]
        
        // Aplicar filtros
        if (filters.category && filters.category !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === filters.category)
        }
        
        if (filters.subcategory && filters.subcategory !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.subcategory === filters.subcategory)
        }
        
        if (filters.minPrice) {
          filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice)
        }
        
        if (filters.maxPrice) {
          filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice)
        }
        
        if (filters.featured !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.featured === filters.featured)
        }
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase()
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
          )
        }

        // Aplicar ordenamiento
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'name-asc':
              filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
              break
            case 'name-desc':
              filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
              break
            case 'price-asc':
              filteredProducts.sort((a, b) => a.price - b.price)
              break
            case 'price-desc':
              filteredProducts.sort((a, b) => b.price - a.price)
              break
            default:
              break
          }
        }
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500))
        
        return {
          success: true,
          data: filteredProducts,
          total: filteredProducts.length
        }
      }
      
      // En producción, hacer llamada real a la API
      const response = await productAPI.get('/products', { params: filters })
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    try {
      if (import.meta.env.DEV) {
        const product = mockProducts.find(p => p.id === parseInt(id))
        await new Promise(resolve => setTimeout(resolve, 300))
        return product ? { success: true, data: product } : { success: false, error: 'Product not found' }
      }
      
      const response = await productAPI.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // Crear un nuevo producto (admin)
  createProduct: async (productData) => {
    try {
      if (import.meta.env.DEV) {
        // Simular creación en desarrollo
        const newProduct = {
          ...productData,
          id: Math.max(...mockProducts.map(p => p.id)) + 1,
          rating: 0,
          reviews: 0,
          featured: false
        }
        mockProducts.push(newProduct)
        await new Promise(resolve => setTimeout(resolve, 500))
        return { success: true, data: newProduct }
      }
      
      const response = await productAPI.post('/products', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Actualizar un producto (admin)
  updateProduct: async (id, productData) => {
    try {
      if (import.meta.env.DEV) {
        // Simular actualización en desarrollo
        const index = mockProducts.findIndex(p => p.id === parseInt(id))
        if (index !== -1) {
          mockProducts[index] = { ...mockProducts[index], ...productData }
          await new Promise(resolve => setTimeout(resolve, 500))
          return { success: true, data: mockProducts[index] }
        }
        throw new Error('Product not found')
      }
      
      const response = await productAPI.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  // Eliminar un producto (admin)
  deleteProduct: async (id) => {
    try {
      if (import.meta.env.DEV) {
        // Simular eliminación en desarrollo
        const index = mockProducts.findIndex(p => p.id === parseInt(id))
        if (index !== -1) {
          const deletedProduct = mockProducts.splice(index, 1)[0]
          await new Promise(resolve => setTimeout(resolve, 500))
          return { success: true, data: deletedProduct }
        }
        throw new Error('Product not found')
      }
      
      const response = await productAPI.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async () => {
    try {
      if (import.meta.env.DEV) {
        const featuredProducts = mockProducts.filter(p => p.featured === true)
        await new Promise(resolve => setTimeout(resolve, 300))
        return { success: true, data: featuredProducts }
      }
      
      const response = await productAPI.get('/products?featured=true')
      return response.data
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    try {
      if (import.meta.env.DEV) {
        const categoryProducts = mockProducts.filter(p => p.category === category)
        await new Promise(resolve => setTimeout(resolve, 300))
        return { success: true, data: categoryProducts }
      }
      
      const response = await productAPI.get(`/products?category=${category}`)
      return response.data
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  // Buscar productos
  searchProducts: async (searchTerm) => {
    try {
      if (import.meta.env.DEV) {
        const searchResults = mockProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        await new Promise(resolve => setTimeout(resolve, 300))
        return { success: true, data: searchResults }
      }
      
      const response = await productAPI.get(`/products?search=${encodeURIComponent(searchTerm)}`)
      return response.data
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  },

  // Actualizar stock de un producto
  updateStock: async (id, stock) => {
    try {
      if (import.meta.env.DEV) {
        const index = mockProducts.findIndex(p => p.id === parseInt(id))
        if (index !== -1) {
          mockProducts[index].stock = stock
          await new Promise(resolve => setTimeout(resolve, 300))
          return { success: true, data: mockProducts[index] }
        }
        throw new Error('Product not found')
      }
      
      const response = await productAPI.patch(`/products/${id}/stock`, { stock })
      return response.data
    } catch (error) {
      console.error('Error updating stock:', error)
      throw error
    }
  },

  // Obtener productos con stock bajo
  getLowStockProducts: async (threshold = 10) => {
    try {
      if (import.meta.env.DEV) {
        const lowStockProducts = mockProducts.filter(p => p.stock <= threshold)
        await new Promise(resolve => setTimeout(resolve, 300))
        return { success: true, data: lowStockProducts }
      }
      
      const response = await productAPI.get(`/products/low-stock?threshold=${threshold}`)
      return response.data
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      throw error
    }
  },

  // Obtener categorías disponibles
  getCategories: async () => {
    try {
      if (import.meta.env.DEV) {
        const categories = [
          {
            id: 'todo',
            name: 'Todo',
            slug: 'todo',
            description: 'Todos los productos disponibles',
            image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
            subcategories: []
          },
          {
            id: 'aves',
            name: 'Aves',
            slug: 'aves',
            description: 'Accesorios para loros, canarios y aves exóticas',
            image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400',
            subcategories: [
              { id: 'camas', name: 'Camas', slug: 'camas' },
              { id: 'bebederos', name: 'Bebederos', slug: 'bebederos' },
              { id: 'comederos', name: 'Comederos', slug: 'comederos' },
              { id: 'escondites', name: 'Escondites', slug: 'escondites' },
              { id: 'juguetes', name: 'Juguetes', slug: 'juguetes' },
              { id: 'ropa', name: 'Ropa', slug: 'ropa' }
            ]
          },
          {
            id: 'mamiferos',
            name: 'Mamíferos',
            slug: 'mamiferos',
            description: 'Accesorios para hurones, conejos y roedores',
            image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400',
            subcategories: [
              { id: 'camas', name: 'Camas', slug: 'camas' },
              { id: 'bebederos', name: 'Bebederos', slug: 'bebederos' },
              { id: 'comederos', name: 'Comederos', slug: 'comederos' },
              { id: 'escondites', name: 'Escondites', slug: 'escondites' },
              { id: 'juguetes', name: 'Juguetes', slug: 'juguetes' },
              { id: 'ropa', name: 'Ropa', slug: 'ropa' }
            ]
          },
          {
            id: 'reptiles',
            name: 'Reptiles',
            slug: 'reptiles',
            description: 'Terrarios y accesorios para reptiles',
            image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400',
            subcategories: [
              { id: 'camas', name: 'Camas', slug: 'camas' },
              { id: 'bebederos', name: 'Bebederos', slug: 'bebederos' },
              { id: 'comederos', name: 'Comederos', slug: 'comederos' },
              { id: 'escondites', name: 'Escondites', slug: 'escondites' },
              { id: 'juguetes', name: 'Juguetes', slug: 'juguetes' },
              { id: 'ropa', name: 'Ropa', slug: 'ropa' }
            ]
          },
          {
            id: 'anfibios',
            name: 'Anfibios',
            slug: 'anfibios',
            description: 'Paludarios y accesorios para ranas y salamandras',
            image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400',
            subcategories: [
              { id: 'camas', name: 'Camas', slug: 'camas' },
              { id: 'bebederos', name: 'Bebederos', slug: 'bebederos' },
              { id: 'comederos', name: 'Comederos', slug: 'comederos' },
              { id: 'escondites', name: 'Escondites', slug: 'escondites' },
              { id: 'juguetes', name: 'Juguetes', slug: 'juguetes' },
              { id: 'ropa', name: 'Ropa', slug: 'ropa' }
            ]
          },
          {
            id: 'peces',
            name: 'Peces',
            slug: 'peces',
            description: 'Acuarios y decoraciones para peces tropicales',
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
            subcategories: [
              { id: 'camas', name: 'Camas', slug: 'camas' },
              { id: 'bebederos', name: 'Bebederos', slug: 'bebederos' },
              { id: 'comederos', name: 'Comederos', slug: 'comederos' },
              { id: 'escondites', name: 'Escondites', slug: 'escondites' },
              { id: 'juguetes', name: 'Juguetes', slug: 'juguetes' },
              { id: 'ropa', name: 'Ropa', slug: 'ropa' }
            ]
          },
          {
            id: 'aracnidos',
            name: 'Arácnidos',
            slug: 'aracnidos',
            description: 'Terrarios especializados para tarántulas y arañas',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            subcategories: [
              { id: 'camas', name: 'Camas', slug: 'camas' },
              { id: 'bebederos', name: 'Bebederos', slug: 'bebederos' },
              { id: 'comederos', name: 'Comederos', slug: 'comederos' },
              { id: 'escondites', name: 'Escondites', slug: 'escondites' },
              { id: 'juguetes', name: 'Juguetes', slug: 'juguetes' },
              { id: 'ropa', name: 'Ropa', slug: 'ropa' }
            ]
          }
        ]
        
        await new Promise(resolve => setTimeout(resolve, 200))
        return { success: true, data: categories }
      }
      
      const response = await productAPI.get('/categories')
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }
}

export default productService