import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';

const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Función para buscar sugerencias de productos
  const fetchSearchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await productService.getAllProducts({ search: query });
      if (response.success && response.data.products) {
        // Limitar a 5 sugerencias y obtener nombres únicos
        const suggestions = response.data.products
          .slice(0, 5)
          .map(product => ({
            id: product._id,
            name: product.name,
            category: product.category,
            image: product.image
          }));
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Función debounced para las sugerencias
  const debouncedFetchSuggestions = useCallback((query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchSuggestions(query);
    }, 300);
  }, [fetchSearchSuggestions]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        if (response.success && response.data.categories) {
          setCategories(response.data.categories);
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
      // Limpiar sugerencias y navegar
      setShowSuggestions(false);
      setSearchSuggestions([]);
      navigate(`/productos?busqueda=${encodeURIComponent(searchTerm.trim())}`);
      // Opcional: limpiar el término de búsqueda después de buscar
      // setSearchTerm('');
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    navigate(`/productos?busqueda=${encodeURIComponent(suggestion.name)}`);
  };

  const handleSearchInputBlur = () => {
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSearchInputFocus = () => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const totalItems = cartItems ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const uniqueItems = cartItems ? cartItems.length : 0; // Número de productos distintos
  const isCartPage = location.pathname === '/carrito';

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
            <div className="search-container">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos en todas las categorías..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchInputFocus}
                  onBlur={handleSearchInputBlur}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  {isSearching ? (
                    <div className="search-loading">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  )}
                </button>
              </form>

              {/* Sugerencias de búsqueda */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="suggestion-image">
                        <img 
                          src={suggestion.image || '/images/products/default-product.jpg'} 
                          alt={suggestion.name}
                          onError={(e) => {
                            e.target.src = '/images/products/default-product.jpg';
                          }}
                        />
                      </div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{suggestion.name}</div>
                        <div className="suggestion-category">
                          {suggestion.category ? suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1) : 'Producto'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                  {!isCartPage && uniqueItems > 0 && (
                    <span className="cart-badge">{uniqueItems}</span>
                  )}
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
                to={`/productos?categoria=${category.id}`}
                className="category-title"
                onClick={toggleSidebar}
              >
                {category.name ? category.name.toUpperCase() : 'MAMÍFEROS'}
                <span className="category-arrow">›</span>
              </Link>
              <div className="subcategory-list">
                {Array.isArray(category.subcategories) && category.subcategories.map((subcategory, index) => (
                  <Link
                    key={subcategory.id || `${category.id}-subcategory-${index}`}
                    to={`/productos?categoria=${category.id}&subcategoria=${subcategory}`}
                    className="subcategory-item"
                    onClick={toggleSidebar}
                  >
                    {subcategory}
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