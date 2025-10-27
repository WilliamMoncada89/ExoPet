import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/productos?busqueda=${encodeURIComponent(searchTerm)}`;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const totalItems = cartItems ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <>
      {/* Top Header con Logo */}
      <div className="top-header">
        <div className="container">
          <Link to="/" className="logo-container">
            <img src="/images/products/exopet-logo.png" alt="ExoPet" className="main-logo" />
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-navbar">
        <div className="container">
          <div className="navbar-content">
            {/* Menu Hamburguesa */}
            <button className="menu-toggle" onClick={toggleSidebar}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="menu-text">CATEGORÍAS</span>
            </button>

            {/* Barra de Búsqueda Central */}
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>

            {/* Acciones de Usuario */}
            <div className="user-actions">
              <Link to="/carrito" className="cart-button">
                <span className="cart-text">CARRITO</span>
                <div className="cart-icon-container">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {totalItems > 0 && <span className="cart-badge">({totalItems})</span>}
                </div>
              </Link>
              
              {isAuthenticated ? (
                <div className="user-menu">
                  <span className="welcome-message">
                    ¡Hola, {user?.firstName || user?.name || 'Usuario'}!
                  </span>
                  <button onClick={handleLogout} className="logout-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>CERRAR SESIÓN</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="login-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>INICIAR SESIÓN</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar de Categorías */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <div className={`categories-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>CATEGORÍAS</h3>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        <div className="sidebar-content">
          {Array.isArray(categories) && categories.map((category) => (
            <div key={category.id} className="category-section">
              <Link 
                to={`/productos?categoria=${category.slug}`}
                className="category-title"
                onClick={toggleSidebar}
              >
                {category.name.toUpperCase()}
                <span className="category-arrow">›</span>
              </Link>
              <div className="subcategory-list">
                {Array.isArray(category.subcategories) && category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.slug}
                    to={`/productos?categoria=${category.slug}&subcategoria=${subcategory.slug}`}
                    className="subcategory-item"
                    onClick={toggleSidebar}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;