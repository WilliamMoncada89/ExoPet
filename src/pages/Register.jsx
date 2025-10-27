import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida'
    }
    
    if (!formData.gender) {
      newErrors.gender = 'El género es requerido'
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
      const { confirmPassword, ...registrationData } = formData
      const result = await authService.register(registrationData)
      
      if (result.success) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.')
        navigate('/login')
      } else {
        setErrors({ general: result.error || 'Error al registrarse' })
      }
    } catch (error) {
      setErrors({ general: 'Error al registrarse. Inténtalo de nuevo.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <img 
          src="/images/products/exopet-logo.png" 
          alt="ExoPet Logo" 
          className="register-logo"
        />
        <h1 className="register-title">CREAR CUENTA</h1>
      </div>
      
      <div className="register-form-container">
        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="firstName" className="form-label">
                NOMBRE *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Tu nombre"
              />
              {errors.firstName && (
                <div className="error-message">
                  {errors.firstName}
                </div>
              )}
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="lastName" className="form-label">
                APELLIDO *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Tu apellido"
              />
              {errors.lastName && (
                <div className="error-message">
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              CORREO ELECTRÓNICO *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <div className="error-message">
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="password" className="form-label">
                CONTRASEÑA *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && (
                <div className="error-message">
                  {errors.password}
                </div>
              )}
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="confirmPassword" className="form-label">
                CONFIRMAR CONTRASEÑA *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && (
                <div className="error-message">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              TELÉFONO *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="+1234567890"
            />
            {errors.phone && (
              <div className="error-message">
                {errors.phone}
              </div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="dateOfBirth" className="form-label">
                FECHA DE NACIMIENTO *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
              />
              {errors.dateOfBirth && (
                <div className="error-message">
                  {errors.dateOfBirth}
                </div>
              )}
            </div>
            
            <div className="form-group half-width">
              <label htmlFor="gender" className="form-label">
                GÉNERO *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`form-input ${errors.gender ? 'error' : ''}`}
              >
                <option value="">Selecciona tu género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
                <option value="prefer-not-to-say">Prefiero no decir</option>
              </select>
              {errors.gender && (
                <div className="error-message">
                  {errors.gender}
                </div>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="register-submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
          </button>
          
          <div className="login-link">
            <button 
              type="button"
              className="register-login-button"
              onClick={() => navigate('/login')}
            >
              ¿YA TIENES CUENTA? INICIA SESIÓN
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register