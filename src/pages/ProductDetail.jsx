import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, checkStock } from '../services/productService';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, isInCart, getItemQuantity, canAddMore, validateCartStock, stockError, clearStockError } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError('Error al cargar el producto');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    const currentInCart = getItemQuantity(product.id || product._id);
    const maxAvailable = product.stock - currentInCart;
    
    if (newQuantity >= 1 && newQuantity <= maxAvailable) {
      setQuantity(newQuantity);
      clearStockError();
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    const currentInCart = getItemQuantity(product.id || product._id);
    const totalRequested = currentInCart + quantity;
    
    if (totalRequested > product.stock) {
      alert(`Solo puedes agregar ${product.stock - currentInCart} unidades más. Ya tienes ${currentInCart} en el carrito.`);
      return;
    }

    setAddingToCart(true);
    try {
      // Log temporal para debug
      console.log('🔍 ProductDetail - Estructura del producto:', product);
      console.log('🔍 ProductDetail - product.id:', product.id);
      console.log('🔍 ProductDetail - product._id:', product._id);
      
      // Verificar stock real del producto usando la función ya importada
      
      // Verificar stock real del producto específico
      const stockResult = await checkStock([{
        productId: product.id || product._id,
        quantity: totalRequested
      }]);
      
      if (!stockResult.data.allAvailable) {
        const stockInfo = stockResult.data.items[0];
        alert(`Stock insuficiente. Disponible: ${stockInfo.availableStock}, solicitado: ${stockInfo.requestedQuantity}`);
        return;
      }

      // Agregar al carrito usando el contexto
      addItem(product, quantity);
      
      // Mostrar mensaje de éxito
      alert(`¡${quantity} ${product.name}${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito!`);
      
      // Resetear cantidad a 1
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error al agregar al carrito. Por favor, intenta nuevamente.');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Sin stock', class: 'out-of-stock' };
    if (stock <= 5) return { text: `Últimas ${stock} unidades`, class: 'low-stock' };
    return { text: 'En stock', class: 'in-stock' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <div className="empty-state">
            <h2 className="text-xl font-semibold mb-4">Producto no encontrado</h2>
            <p className="text-gray-600 mb-6">{error || 'El producto que buscas no existe.'}</p>
            <button 
              onClick={() => navigate('/productos')}
              className="btn btn-primary"
            >
              Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const images = product.images || [product.image];
  const currentInCart = getItemQuantity(product.id || product._id);
  const maxAvailable = product.stock - currentInCart;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb mb-6">
          <button 
            onClick={() => navigate('/productos')}
            className="breadcrumb-link"
          >
            Productos
          </button>
          <span className="breadcrumb-separator">›</span>
          <button 
            onClick={() => navigate(`/productos?categoria=${product.category}`)}
            className="breadcrumb-link"
          >
            {product.category}
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Galería de imágenes */}
          <div className="product-gallery">
            <div className="main-image-container">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="main-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=Imagen+no+disponible';
                }}
              />
              {product.featured && (
                <div className="featured-badge">Destacado</div>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="low-stock-badge">Pocas unidades</div>
              )}
              {product.stock === 0 && (
                <div className="out-of-stock-badge">Sin stock</div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="thumbnail-gallery">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+img';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-meta">
                <span className="product-category">Categoría: {product.category}</span>
                <div className={`stock-status ${stockStatus.class}`}>
                  {stockStatus.text}
                </div>
              </div>
            </div>

            <div className="product-price-section">
              <div className="current-price">{formatPrice(product.price)}</div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="original-price">{formatPrice(product.originalPrice)}</div>
              )}
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Características</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Controles de compra */}
            <div className="purchase-controls">
              {/* Información del carrito */}
              {currentInCart > 0 && (
                <div className="cart-info mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    Ya tienes <strong>{currentInCart}</strong> unidad{currentInCart > 1 ? 'es' : ''} en el carrito
                  </p>
                </div>
              )}

              {/* Error de stock */}
              {stockError && (
                <div className="stock-error mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{stockError}</p>
                </div>
              )}

              <div className="quantity-selector">
                <label htmlFor="quantity">
                  Cantidad: 
                  {maxAvailable > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      (máximo {maxAvailable} disponible{maxAvailable > 1 ? 's' : ''})
                    </span>
                  )}
                </label>
                <div className="quantity-input-group">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={maxAvailable}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= maxAvailable || maxAvailable === 0}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart || maxAvailable === 0}
                  className={`btn btn-primary add-to-cart-btn ${
                    product.stock === 0 || addingToCart || maxAvailable === 0 ? 'btn-disabled' : ''
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <span className="loading-spinner-sm"></span>
                      Agregando...
                    </>
                  ) : product.stock === 0 ? (
                    'Sin stock'
                  ) : maxAvailable === 0 ? (
                    'Máximo en carrito'
                  ) : (
                    <>
                      🛒 Agregar al carrito
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => navigate('/productos')}
                  className="btn btn-secondary"
                >
                  Seguir comprando
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="additional-info">
              <div className="info-item">
                <strong>Envío:</strong> Gratis en compras sobre $30.000
              </div>
              <div className="info-item">
                <strong>Garantía:</strong> 30 días de garantía
              </div>
              <div className="info-item">
                <strong>Devoluciones:</strong> 15 días para devoluciones
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        <div className="related-products-section">
          <h2>Productos relacionados</h2>
          <div className="related-products-grid">
            {/* Aquí se mostrarían productos relacionados */}
            <div className="related-placeholder">
              <p>Productos relacionados se cargarán aquí...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;