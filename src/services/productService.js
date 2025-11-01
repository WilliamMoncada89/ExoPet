// src/services/productService.js
import api from "./api.js";

// Creamos un objeto con todas las funciones
const productService = {
  // Obtener todos los productos
  getAllProducts: async (filters = {}) => {
    try {
      const response = await api.get("/products", { params: filters });
      return response.data;
    } catch (error) {
      console.error("⚠️ Error al obtener los productos:", error);
      return { success: false, data: { products: [] } };
    }
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("⚠️ Error al obtener el producto:", error);
      return { success: false, data: null };
    }
  },

  // Obtener categorías
  getCategories: async () => {
    try {
      const response = await api.get("/products/categories");
      return response.data;
    } catch (error) {
      console.error("⚠️ Error al obtener las categorías:", error);
      return { success: false, data: { categories: [] } };
    }
  },

  // Buscar productos
  searchProducts: async (query, limit = 10) => {
    try {
      const response = await api.get("/products/search", { 
        params: { q: query, limit } 
      });
      return response.data;
    } catch (error) {
      console.error("⚠️ Error al buscar productos:", error);
      return { success: false, data: { products: [] } };
    }
  },

  // Crear producto (admin)
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return response.data;
    } catch (error) {
      console.error("⚠️ Error al crear el producto:", error);
      throw error;
    }
  },

  // Actualizar producto (admin)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("⚠️ Error al actualizar el producto:", error);
      throw error;
    }
  },

  // Eliminar producto (admin)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("⚠️ Error al eliminar el producto:", error);
      throw error;
    }
  },

  // Verificar stock de productos
  checkStock: async (items) => {
    console.log('🔍 checkStock llamado con items:', items);
    try {
      const response = await api.post('/products/check-stock', { items });
      console.log('✅ checkStock respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al verificar stock:', error);
      throw error;
    }
  }
};

// Exportación por defecto
export default productService;

// También exportamos individualmente y el objeto completo como exportación nombrada
export { productService };
export const { 
  getAllProducts, 
  getProductById, 
  getCategories, 
  searchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  checkStock 
} = productService;
