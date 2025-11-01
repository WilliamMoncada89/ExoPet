import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkStock } from '../services/productService';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addItem, isInCart, getItemQuantity, canAddMore } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevenir navegación del Link
    e.stopPropagation();
    
    if (product.stock === 0) return;

    try {
      console.log('🛒 ProductCard: Intentando agregar producto al carrito:', product.name);
      
      // Usar checkStock ya importado para verificar el stock real del producto
      const productId = product.id || product._id;
      const currentInCart = getItemQuantity(productId);
      const totalRequested = currentInCart + 1;
      
      console.log('📊 ProductCard: productId:', productId, 'currentInCart:', currentInCart, 'totalRequested:', totalRequested);
      
      if (!productId) {
        console.error('❌ ProductCard: No se pudo obtener el ID del producto');
        alert('Error: No se pudo identificar el producto');
        return;
      }
      
      // Verificar stock real del producto específico
      const stockResult = await checkStock([{
        productId: productId,
        quantity: totalRequested
      }]);
      
      if (!stockResult.data.allAvailable) {
        const stockInfo = stockResult.data.items[0];
        alert(`Stock insuficiente. Disponible: ${stockInfo.availableStock}, en carrito: ${currentInCart}`);
        return;
      }

      // Si hay stock disponible, agregar al carrito
      addItem(product, 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error al agregar al carrito. Por favor, intenta nuevamente.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Sin stock', class: 'out-of-stock', color: 'text-red-600' };
    if (stock <= 5) return { text: `Pocas unidades (${stock})`, class: 'low-stock', color: 'text-amber-600' };
    return { text: `En stock (${stock})`, class: 'in-stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus(product.stock);
  const inCart = isInCart(product.id || product._id);
  const cartQuantity = getItemQuantity(product.id || product._id);
  const canAddMoreItems = canAddMore(product.id || product._id, product.stock);

  return (
    <div className={`product-card ${viewMode === 'list' ? 'product-card-list' : 'product-card-grid'}`}>
      <Link to={`/producto/${product.id || product._id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
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
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">{formatPrice(product.price)}</div>
          <div className={`product-stock ${stockStatus.class} ${stockStatus.color} text-sm font-medium`}>
            {stockStatus.text}
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || !canAddMoreItems}
          className={`btn btn-primary btn-sm ${product.stock === 0 || !canAddMoreItems ? 'btn-disabled' : ''}`}
        >
          {product.stock === 0 ? (
            'Sin stock'
          ) : !canAddMoreItems ? (
            `🛒 Máximo en carrito (${cartQuantity})`
          ) : inCart ? (
            `🛒 En carrito (${cartQuantity})`
          ) : (
            '🛒 Agregar'
          )}
        </button>
        
        <Link 
          to={`/producto/${product.id}`}
          className="btn btn-secondary btn-sm"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;