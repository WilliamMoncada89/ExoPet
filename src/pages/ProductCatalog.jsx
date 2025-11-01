import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { productService } from "../services/productService";
import ProductCard from '../components/ProductCard';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Todos los productos para filtrado local
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [localSearch, setLocalSearch] = useState(''); // Estado local para el input
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const searchTimeoutRef = useRef(null);

  // Obtener parámetros de URL
  const categoria = searchParams.get('categoria') || '';
  const subcategoria = searchParams.get('subcategoria') || '';
  const busqueda = searchParams.get('busqueda') || '';

  // Sincronizar el estado local con el parámetro de URL
  useEffect(() => {
    setLocalSearch(busqueda);
  }, [busqueda]);

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

  // Función para filtrar productos localmente
  const filterProductsLocally = useCallback((searchTerm, categoryFilter, subcategoryFilter, productList) => {
    let filtered = [...productList];

    // Filtrar por categoría
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filtrar por subcategoría
    if (subcategoryFilter) {
      filtered = filtered.filter(product => product.subcategory === subcategoryFilter);
    }

    // Filtrar por búsqueda (solo si hay término de búsqueda)
    if (searchTerm && searchTerm.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, []);

  // Función debounced para actualizar la URL
  const debouncedSearch = useCallback((searchTerm) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm && searchTerm.trim()) {
        params.set('busqueda', searchTerm.trim());
      } else {
        params.delete('busqueda');
      }
      setSearchParams(params);
      setSearching(false);
    }, 300); // 300ms de delay
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (categoria) filters.category = categoria;
        if (subcategoria) filters.subcategory = subcategoria;
        // No incluir búsqueda en la llamada inicial para obtener todos los productos de la categoría

        const response = await productService.getAllProducts(filters);
        console.log('🔍 ProductCatalog: Respuesta de getAllProducts:', response);
        if (response.success && response.data.products) {
          const fetchedProducts = response.data.products;
          console.log('✅ ProductCatalog: Productos cargados:', fetchedProducts.length);
          setAllProducts(fetchedProducts);
          
          // Aplicar filtro de búsqueda localmente si existe
          const filteredProducts = filterProductsLocally(busqueda, categoria, subcategoria, fetchedProducts);
          setProducts(filteredProducts);
        } else {
          console.log('❌ ProductCatalog: No se pudieron cargar productos');
          setAllProducts([]);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoria, subcategoria]); // Removido 'busqueda' de las dependencias

  // Efecto separado para manejar cambios en la búsqueda
  useEffect(() => {
    if (allProducts.length > 0) {
      const filteredProducts = filterProductsLocally(busqueda, categoria, subcategoria, allProducts);
      setProducts(filteredProducts);
    }
  }, [busqueda, allProducts, filterProductsLocally, categoria, subcategoria]);

  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('categoria', newCategory);
    } else {
      params.delete('categoria');
    }
    params.delete('subcategoria'); // Reset subcategory when changing category
    setSearchParams(params);
  };

  const handleSubcategoryChange = (newSubcategory) => {
    const params = new URLSearchParams(searchParams);
    if (newSubcategory) {
      params.set('subcategoria', newSubcategory);
    } else {
      params.delete('subcategoria');
    }
    setSearchParams(params);
  };

  const handleSearchChange = (newSearch) => {
    setLocalSearch(newSearch); // Actualizar estado local inmediatamente
    setSearching(true); // Mostrar indicador de búsqueda
    
    // Filtrar productos inmediatamente para respuesta instantánea
    if (allProducts.length > 0) {
      const filteredProducts = filterProductsLocally(newSearch, categoria, subcategoria, allProducts);
      setProducts(filteredProducts);
    }
    
    // Actualizar URL con debounce
    debouncedSearch(newSearch);
  };

  // Obtener subcategorías de la categoría seleccionada
  const selectedCategory = categories.find(cat => cat.id === categoria);
  const availableSubcategories = selectedCategory?.subcategories || [];

  // Obtener nombre de la categoría para mostrar
  const getCategoryDisplayName = () => {
    if (categoria) {
      const cat = categories.find(c => c.id === categoria);
      return cat?.name || categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }
    return 'Todos los productos';
  };

  if (loading) return (
    <div className="catalog-container">
      <div className="loading-spinner">
        <p>Cargando productos...</p>
      </div>
    </div>
  );

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div className="catalog-title-section">
          <h1>{getCategoryDisplayName()}</h1>
          {subcategoria && (
            <h2 className="subcategory-title">
              {subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1)}
            </h2>
          )}
          <p className="products-count">
            {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="view-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista de cuadrícula"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vista de lista"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="filters-section">
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="search">Buscar:</label>
              <div className="search-input-container">
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar producto..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="search-input"
                />
                {searching && (
                  <div className="search-indicator">
                    <span className="search-spinner"></span>
                  </div>
                )}
                {localSearch && (
                  <button
                    className="clear-search-btn"
                    onClick={() => handleSearchChange('')}
                    title="Limpiar búsqueda"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

          <div className="filter-group">
            <label htmlFor="category">Categoría:</label>
            <select 
              id="category"
              value={categoria} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="category-select"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {categoria && availableSubcategories.length > 0 && (
            <div className="filter-group">
              <label htmlFor="subcategory">Subcategoría:</label>
              <select 
                id="subcategory"
                value={subcategoria} 
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className="subcategory-select"
              >
                <option value="">Todas las subcategorías</option>
                {availableSubcategories.map((subcat, index) => (
                  <option key={`${categoria}-${subcat}-${index}`} value={subcat}>
                    {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {(categoria || subcategoria || busqueda) && (
          <button 
            className="clear-filters-btn"
            onClick={() => setSearchParams({})}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className={`product-container ${viewMode === 'list' ? 'product-list' : 'product-grid'}`}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} viewMode={viewMode} />
          ))
        ) : (
          <div className="no-products">
            <p>No se encontraron productos con los filtros seleccionados.</p>
            <button 
              className="clear-filters-btn"
              onClick={() => setSearchParams({})}
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
