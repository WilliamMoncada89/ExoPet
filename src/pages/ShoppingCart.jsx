import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ShoppingCart = () => {
  const { 
    items, 
    totalAmount, 
    totalItems, 
    updateQuantity, 
    removeItem, 
    clearCart,
    formatPrice 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="cart-empty">
          <div className="cart-empty-content">
            <div className="cart-empty-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>¡Agrega algunos productos para tus mascotas!</p>
            <Link to="/productos" className="btn btn-primary">
              Explorar productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-page">
        <div className="cart-header">
          <h1>Carrito de Compras</h1>
          <div className="cart-summary-header">
            <span className="cart-items-count">{totalItems} productos</span>
            <button 
              onClick={handleClearCart}
              className="btn btn-outline btn-sm"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Imagen+no+disponible';
                    }}
                  />
                </div>
                
                <div className="cart-item-info">
                  <h3 className="cart-item-name">
                    <Link to={`/producto/${item.id}`}>
                      {item.name}
                    </Link>
                  </h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-price">
                    {formatPrice(item.price)} c/u
                  </div>
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-item-btn"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="cart-summary">
              <h3>Resumen del pedido</h3>
              
              <div className="summary-line">
                <span>Subtotal ({totalItems} productos)</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              
              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="summary-line summary-total">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              
              <div className="cart-actions">
                <Link 
                  to="/checkout" 
                  className="btn btn-primary btn-lg btn-full"
                >
                  Proceder al pago
                </Link>
                
                <Link 
                  to="/productos" 
                  className="btn btn-secondary btn-lg btn-full"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
            
            <div className="shipping-info">
              <h4>Información de envío</h4>
              <ul>
                <li>✅ Envío gratis en compras sobre $30.000</li>
                <li>📦 Entrega en 2-3 días hábiles</li>
                <li>🔄 Devoluciones gratuitas</li>
                <li>📞 Soporte 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;