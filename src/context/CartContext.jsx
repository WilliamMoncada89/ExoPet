import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { checkStock } from '../services/productService';

// Crear el contexto
const CartContext = createContext();

// Tipos de acciones para el reducer
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_STOCK_ERROR: 'SET_STOCK_ERROR',
  CLEAR_STOCK_ERROR: 'CLEAR_STOCK_ERROR',
  UPDATE_STOCK: 'UPDATE_STOCK'
};

// Estado inicial del carrito
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  stockError: null,
  isCheckingStock: false
};

// Función para obtener el ID del producto (maneja tanto _id como id)
const getProductId = (product) => {
  return product.id || product._id;
};

// Función para calcular totales
const calculateTotals = (items) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// Reducer del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const productId = getProductId(product);
      const existingItemIndex = state.items.findIndex(item => item.id === productId);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar cantidad
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo
        const newItem = {
          id: productId,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock)
        };
        newItems = [...state.items, newItem];
      }
      
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload.productId);
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        return cartReducer(state, { 
          type: CART_ACTIONS.REMOVE_ITEM, 
          payload: { productId } 
        });
      }
      
      const newItems = state.items.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      );
      
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return initialState;
    }

    case CART_ACTIONS.LOAD_CART: {
      const items = action.payload.items || [];
      const totals = calculateTotals(items);
      return {
        ...state,
        items,
        ...totals
      };
    }

    case CART_ACTIONS.SET_STOCK_ERROR: {
      return {
        ...state,
        stockError: action.payload.error,
        isCheckingStock: false
      };
    }

    case CART_ACTIONS.CLEAR_STOCK_ERROR: {
      return {
        ...state,
        stockError: null
      };
    }

    case CART_ACTIONS.UPDATE_STOCK: {
      const { stockUpdates } = action.payload;
      const newItems = state.items.map(item => {
        const stockUpdate = stockUpdates.find(update => update.productId === item.id);
        if (stockUpdate) {
          return {
            ...item,
            stock: stockUpdate.availableStock,
            quantity: Math.min(item.quantity, stockUpdate.availableStock)
          };
        }
        return item;
      });
      
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals
      };
    }

    default:
      return state;
  }
};

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('exopet-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({ 
          type: CART_ACTIONS.LOAD_CART, 
          payload: { items: cartData.items || [] } 
        });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('exopet-cart', JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state]);

  // Funciones de acción
  const addItem = (product, quantity = 1) => {
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { product, quantity } 
    });
  };

  const removeItem = (productId) => {
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { productId } 
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { productId, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Funciones de utilidad
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  // Verificar stock de todos los items del carrito
  const validateCartStock = async () => {
    if (state.items.length === 0) return true;

    try {
      dispatch({ type: CART_ACTIONS.CLEAR_STOCK_ERROR });
      
      const items = state.items.map(item => ({
        productId: item.id, // Ya está normalizado por getProductId
        quantity: item.quantity
      }));

      const stockResult = await checkStock(items);
      
      // Actualizar el stock de los productos en el carrito
      if (stockResult.data.items) {
        dispatch({
          type: CART_ACTIONS.UPDATE_STOCK,
          payload: { stockUpdates: stockResult.data.items }
        });
      }
      
      if (!stockResult.data.allAvailable) {
        const unavailableItems = stockResult.data.items
          .filter(item => !item.isAvailable)
          .map(item => {
            const cartItem = state.items.find(ci => ci.id === item.productId);
            return `${cartItem?.name || 'Producto'}: solicitado ${item.requestedQuantity}, disponible ${item.availableStock}`;
          });
        
        dispatch({ 
          type: CART_ACTIONS.SET_STOCK_ERROR, 
          payload: { 
            error: `Stock insuficiente para: ${unavailableItems.join(', ')}` 
          } 
        });
        return false;
      }
      
      return true;
    } catch (error) {
      dispatch({ 
        type: CART_ACTIONS.SET_STOCK_ERROR, 
        payload: { 
          error: 'Error al verificar stock. Intenta nuevamente.' 
        } 
      });
      return false;
    }
  };

  // Limpiar errores de stock
  const clearStockError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_STOCK_ERROR });
  };

  // Verificar si se puede agregar más cantidad de un producto
  const canAddMore = (productId, currentStock) => {
    const currentQuantity = getItemQuantity(productId);
    return currentQuantity < currentStock;
  };

  const value = {
    // Estado
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    stockError: state.stockError,
    isCheckingStock: state.isCheckingStock,
    
    // Acciones
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    
    // Utilidades
    getItemQuantity,
    isInCart,
    formatPrice,
    validateCartStock,
    clearStockError,
    canAddMore
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;