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
  (error) => Promise.reject(error)
)

const parseResponse = (response) => response?.data ?? {}

export const productService = {
  // Obtener todos los productos con filtros opcionales
  getAllProducts: async (filters = {}) => {
    try {
      const response = await productAPI.get('/products', { params: filters })
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al obtener productos')
      }

      return {
        success: true,
        data: data?.products ?? [],
        pagination: data?.pagination ?? null,
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    try {
      const response = await productAPI.get(`/products/${id}`)
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al obtener el producto')
      }

      return { success: true, data: data?.product ?? null }
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // Crear un nuevo producto (admin)
  createProduct: async (productData) => {
    try {
      const response = await productAPI.post('/products', productData)
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al crear el producto')
      }

      return { success: true, data: data?.product ?? null }
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Actualizar un producto (admin)
  updateProduct: async (id, productData) => {
    try {
      const response = await productAPI.patch(`/products/${id}`, productData)
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al actualizar el producto')
      }

      return { success: true, data: data?.product ?? null }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  // Eliminar un producto (admin)
  deleteProduct: async (id) => {
    try {
      const response = await productAPI.delete(`/products/${id}`)
      const { success, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al eliminar el producto')
      }

      return { success: true, message: message || 'Producto eliminado correctamente' }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async () => {
    try {
      const response = await productAPI.get('/products/featured')
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al obtener productos destacados')
      }

      return { success: true, data: data?.products ?? [] }
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    try {
      const response = await productAPI.get('/products', { params: { category } })
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al obtener productos por categoría')
      }

      return { success: true, data: data?.products ?? [], pagination: data?.pagination ?? null }
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  // Buscar productos
  searchProducts: async (searchTerm) => {
    try {
      const response = await productAPI.get('/products', { params: { search: searchTerm } })
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al buscar productos')
      }

      return { success: true, data: data?.products ?? [], pagination: data?.pagination ?? null }
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  },

  // Actualizar stock de un producto
  updateStock: async (id, stock) => {
    try {
      const response = await productAPI.patch(`/products/${id}/stock`, { stock })
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al actualizar el stock')
      }

      return { success: true, data: data?.product ?? null }
    } catch (error) {
      console.error('Error updating stock:', error)
      throw error
    }
  },

  // Obtener productos con stock bajo
  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await productAPI.get('/products/low-stock', { params: { threshold } })
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al obtener productos con stock bajo')
      }

      return { success: true, data: data?.products ?? [] }
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      throw error
    }
  },

  // Obtener categorías disponibles
  getCategories: async () => {
    try {
      const response = await productAPI.get('/products/categories')
      const { success, data, message } = parseResponse(response)

      if (!success) {
        throw new Error(message || 'Error al obtener categorías')
      }

      return { success: true, data: data?.categories ?? [] }
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },
}

export default productService
