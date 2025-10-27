import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('exopet-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('exopet-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario')
    }
  },

  async verifyToken(token) {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw new Error('Token inválido')
    }
  },

  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil')
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil')
    }
  }
}

export default api