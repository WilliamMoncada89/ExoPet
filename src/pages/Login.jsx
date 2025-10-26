import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate('/')
      } else {
        setErrors({ general: result.error || 'Error al iniciar sesión' })
      }
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Inténtalo de nuevo.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <img 
          src="/images/products/exopet-logo.png" 
          alt="ExoPet Logo" 
          className="login-logo"
        />
        <h1 className="login-title">INICIAR SESIÓN</h1>
      </div>
      
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Ingresa tu correo electrónico"
            />
            {errors.email && (
              <div className="error-message">
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              CONTRASEÑA
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Ingresa tu contraseña"
            />
            {errors.password && (
              <div className="error-message">
                {errors.password}
              </div>
            )}
          </div>
          
          <div className="forgot-password">
            <a href="#" className="forgot-link">
              ¿OLVIDASTE TU CONTRASEÑA?
            </a>
          </div>
          
          <button 
            type="submit" 
            className="login-submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>
          
          <div className="register-link">
            <span>¿NO ESTÁS REGISTRADO?</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login