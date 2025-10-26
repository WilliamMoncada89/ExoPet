import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addItem, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevenir navegación del Link
    e.stopPropagation();
    
    if (product.stock > 0) {
      addItem(product, 1);
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
    if (stock <= 5) return { text: 'Pocas unidades', class: 'low-stock' };
    return { text: 'En stock', class: 'in-stock' };
  };

  const stockStatus = getStockStatus(product.stock);
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="product-card">
      <Link to={`/producto/${product.id}`} className="product-link">
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
          <div className={`product-stock ${stockStatus.class}`}>
            {stockStatus.text}
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`btn btn-primary btn-sm ${product.stock === 0 ? 'btn-disabled' : ''}`}
        >
          {product.stock === 0 ? (
            'Sin stock'
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