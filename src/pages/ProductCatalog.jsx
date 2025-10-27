import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, Grid, List } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/productService'

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: searchParams.get('categoria') || 'all',
    subcategory: searchParams.get('subcategoria') || 'all',
    search: searchParams.get('busqueda') || searchParams.get('search') || '',
    sortBy: 'name-asc',
    minPrice: '',
    maxPrice: ''
  })

  const sortOptions = [
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' }
  ]

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    // Actualizar filtros basados en parámetros de URL
    const categoryParam = searchParams.get('categoria') || 'all'
    const subcategoryParam = searchParams.get('subcategoria') || 'all'
    const searchParam = searchParams.get('busqueda') || searchParams.get('search') || ''
    
    setFilters(prev => ({
      ...prev,
      category: categoryParam,
      subcategory: subcategoryParam,
      search: searchParam
    }))
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchInitialData = async () => {
    try {
      const categoriesResponse = await productService.getCategories()
      if (categoriesResponse.success) {
        const allCategories = [
          { id: 'all', name: 'Todas las Categorías' },
          ...categoriesResponse.data
        ]
        setCategories(allCategories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Preparar filtros para la API
      const apiFilters = { ...filters }
      
      // Si la categoría es 'all', no enviar el filtro de categoría
      if (apiFilters.category === 'all') {
        delete apiFilters.category
      }
      
      const response = await productService.getAllProducts(apiFilters)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    
    // Si cambia la categoría, resetear subcategoría
    if (key === 'category') {
      newFilters.subcategory = 'all'
    }
    
    setFilters(newFilters)
    
    // Actualizar URL params
    const newSearchParams = new URLSearchParams()
    if (newFilters.category !== 'all') {
      newSearchParams.set('categoria', newFilters.category)
    }
    if (newFilters.subcategory !== 'all') {
      newSearchParams.set('subcategoria', newFilters.subcategory)
    }
    if (newFilters.search) {
      newSearchParams.set('busqueda', newFilters.search)
    }
    setSearchParams(newSearchParams)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      subcategory: 'all',
      search: '',
      sortBy: 'name-asc',
      minPrice: '',
      maxPrice: ''
    })
    setSearchParams({})
  }

  // Obtener subcategorías de la categoría seleccionada
  const getSubcategories = () => {
    if (filters.category === 'all') return []
    const selectedCategory = categories.find(cat => cat.id === filters.category)
    return selectedCategory?.subcategories || []
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="catalog-header mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Catálogo de Animales Exóticos
          </h1>
          <p className="text-lg text-gray-600">
            Descubre nuestra amplia selección de animales exóticos
          </p>
        </div>

        {/* Filters and Search */}
        <div className="filters-section card mb-8">
          <div className="filters-row">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-group">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar animales..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
            </form>

            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="filters-row">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Categoría:</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            {filters.category !== 'all' && getSubcategories().length > 0 && (
              <div className="filter-group">
                <label className="filter-label">Tipo de Producto:</label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos los productos</option>
                  {getSubcategories().map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Filter */}
            <div className="filter-group">
              <label className="filter-label">Ordenar por:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Precio:</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <button onClick={clearFilters} className="btn btn-secondary">
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="results-header mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filters.category !== 'all' && filters.subcategory !== 'all' 
              ? `${categories.find(cat => cat.id === filters.category)?.name || ''} - ${getSubcategories().find(sub => sub.id === filters.subcategory)?.name || ''}`
              : filters.category !== 'all' 
                ? categories.find(cat => cat.id === filters.category)?.name || 'Productos'
                : 'Todos los Productos'
            }
          </h2>
          <p className="text-gray-600">
            {loading ? 'Cargando...' : `${products.length} productos encontrados`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Cargando productos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="text-center py-12">
              <Filter size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar los filtros o buscar con otros términos
              </p>
              <button onClick={clearFilters} className="btn btn-primary">
                Ver todos los productos
              </button>
            </div>
          </div>
        ) : (
          <div className={`products-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCatalog