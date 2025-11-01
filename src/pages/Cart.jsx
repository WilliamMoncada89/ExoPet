import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    validateCartStock,
    stockError,
    isCheckingStock: isValidating
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    document.title = 'Carrito de Compras - ExoPet';
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => removeItem(productId);

  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }
    try {
      await validateCartStock();
      if (!stockError) navigate('/checkout');
    } catch (error) {
      console.error('Error validating stock:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <div className="cart-empty-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestros productos para tu mascota.</p>
          <Link to="/productos" className="btn btn-primary">Ver productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Encabezado */}
      <div className="cart-header">
        <h1>
          Carrito de Compras ({cartItems.length} producto
          {cartItems.length !== 1 ? 's' : ''})
        </h1>
        <button onClick={clearCart} className="btn btn-outline btn-sm">
          Vaciar carrito
        </button>
      </div>

      {/* Contenido principal */}
      <div className="cart-content">
        {/* Sección izquierda: productos */}
        <div className="cart-items">
          <div className="cart-table-header">
            <div>PRODUCTO</div>
            <div>PRECIO</div>
            <div>CANTIDAD</div>
            <div>SUBTOTAL</div>
          </div>

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-product">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="remove-item-btn"
                  title="Eliminar producto"
                >
                  ✕
                </button>
                <div className="cart-item-image">
                  <img
                    src={item.image || '/images/products/default-product.jpg'}
                    alt={item.name}
                  />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-description">
                    Stock: {item.stock ?? 'N/D'}
                  </p>
                </div>
              </div>

              <div className="cart-item-price">
                ${item.price.toLocaleString('es-CL')}
              </div>

              <div className="cart-item-qty">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={item.stock && item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                ${(item.price * item.quantity).toLocaleString('es-CL')}
              </div>
            </div>
          ))}

          {/* Acciones debajo de la tabla */}
          <div className="cart-actions">
            <div className="coupon-section">
              <input
                type="text"
                placeholder="Código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button className="btn btn-secondary btn-sm">
                Aplicar cupón
              </button>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={validateCartStock}
              disabled={isValidating}
            >
              {isValidating ? 'Actualizando...' : 'Actualizar Carrito'}
            </button>
          </div>
        </div>

        {/* Sección derecha: resumen */}
        <div className="cart-sidebar">
          <div className="cart-summary">
            <h3>Total del Carrito</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">
                ${total.toLocaleString('es-CL')}
              </span>
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={handleProceedToCheckout}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
