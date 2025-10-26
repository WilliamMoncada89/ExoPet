import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import pkg from 'transbank-sdk';
const { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } = pkg;

// Configurar Transbank
const configureTransbank = () => {
  if (process.env.TRANSBANK_ENVIRONMENT === 'production') {
    WebpayPlus.configureForProduction(
      process.env.TRANSBANK_COMMERCE_CODE_PROD,
      process.env.TRANSBANK_API_KEY_PROD
    );
  } else {
    // Configuración para integración/testing
    WebpayPlus.configureForIntegration(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY
    );
  }
};

// Inicializar configuración de Transbank
configureTransbank();

// Crear orden y iniciar proceso de pago
export const createOrder = catchAsync(async (req, res, next) => {
  const { items, shippingAddress, notes } = req.body;

  // Validar items
  if (!items || items.length === 0) {
    return next(new AppError('No hay productos en el carrito', 400));
  }

  // Verificar stock y calcular totales
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    
    if (!product || !product.isActive) {
      return next(new AppError(`Producto ${item.name} no disponible`, 400));
    }

    if (!product.isAvailable(item.quantity)) {
      return next(new AppError(`Stock insuficiente para ${product.name}`, 400));
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image
    });
  }

  // Calcular costos adicionales
  const shippingCost = subtotal >= 50000 ? 0 : 5000; // Envío gratis sobre $50.000
  const tax = Math.round(subtotal * 0.19); // IVA 19%
  const total = subtotal + shippingCost + tax;

  // Crear orden
  const order = await Order.create({
    user: req.user?._id, // Opcional para invitados
    items: orderItems,
    shippingAddress,
    subtotal,
    shippingCost,
    tax,
    total,
    notes,
    paymentInfo: {
      method: 'webpay',
      amount: total
    }
  });

  // Crear transacción en Transbank
  try {
    const buyOrder = order.orderNumber;
    const sessionId = `session_${order._id}`;
    const returnUrl = `${process.env.FRONTEND_URL}/checkout/return`;

    const createResponse = await WebpayPlus.Transaction.create(
      buyOrder,
      sessionId,
      total,
      returnUrl
    );

    // Actualizar orden con token de Transbank
    order.paymentInfo.transactionId = createResponse.token;
    await order.save();

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total
        },
        payment: {
          token: createResponse.token,
          url: createResponse.url
        }
      }
    });

  } catch (error) {
    // Si falla la creación del pago, eliminar la orden
    await Order.findByIdAndDelete(order._id);
    return next(new AppError('Error al procesar el pago', 500));
  }
});

// Confirmar pago de Transbank
export const confirmPayment = catchAsync(async (req, res, next) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return next(new AppError('Token de transacción requerido', 400));
  }

  try {
    // Confirmar transacción con Transbank
    const commitResponse = await WebpayPlus.Transaction.commit(token_ws);

    // Buscar orden por token
    const order = await Order.findOne({
      'paymentInfo.transactionId': token_ws
    }).populate('items.product');

    if (!order) {
      return next(new AppError('Orden no encontrada', 404));
    }

    // Actualizar información de pago
    order.paymentInfo.status = commitResponse.response_code === 0 ? 'approved' : 'rejected';
    order.paymentInfo.authorizationCode = commitResponse.authorization_code;
    order.paymentInfo.cardType = commitResponse.card_detail?.card_type;
    order.paymentInfo.cardNumber = commitResponse.card_detail?.card_number;
    order.paymentInfo.installments = commitResponse.installments_number || 0;
    order.paymentInfo.transactionDate = new Date();

    if (order.paymentInfo.status === 'approved') {
      order.status = 'confirmed';
      
      // Reducir stock de productos
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.reduceStock(item.quantity);
          await product.save();
        }
      }
    } else {
      order.status = 'cancelled';
      order.cancelReason = 'Pago rechazado';
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total
        },
        payment: {
          status: order.paymentInfo.status,
          authorizationCode: order.paymentInfo.authorizationCode,
          transactionDate: order.paymentInfo.transactionDate
        }
      }
    });

  } catch (error) {
    console.error('Error confirmando pago:', error);
    return next(new AppError('Error al confirmar el pago', 500));
  }
});

// Obtener orden por ID
export const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const order = await Order.findById(id)
    .populate('items.product', 'name image')
    .populate('user', 'firstName lastName email');

  if (!order) {
    return next(new AppError('Orden no encontrada', 404));
  }

  // Verificar permisos (usuario propietario o admin)
  if (req.user && order.user && !order.user._id.equals(req.user._id) && req.user.role !== 'admin') {
    return next(new AppError('No tienes permisos para ver esta orden', 403));
  }

  res.status(200).json({
    success: true,
    data: { order }
  });
});

// Obtener órdenes del usuario
export const getUserOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments({ user: req.user._id })
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalOrders: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// Obtener todas las órdenes (Admin)
export const getAllOrders = catchAsync(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    startDate, 
    endDate,
    search 
  } = req.query;

  const filter = {};
  
  if (status) filter.status = status;
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { orderNumber: new RegExp(search, 'i') },
      { 'shippingAddress.email': new RegExp(search, 'i') },
      { 'shippingAddress.firstName': new RegExp(search, 'i') },
      { 'shippingAddress.lastName': new RegExp(search, 'i') }
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalOrders: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// Actualizar estado de orden (Admin)
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, trackingNumber, notes } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError('Orden no encontrada', 404));
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (notes) order.notes = notes;

  if (status === 'delivered') {
    order.markAsDelivered();
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: { order }
  });
});

// Cancelar orden
export const cancelOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    return next(new AppError('Orden no encontrada', 404));
  }

  // Verificar permisos
  if (req.user.role !== 'admin' && !order.user.equals(req.user._id)) {
    return next(new AppError('No tienes permisos para cancelar esta orden', 403));
  }

  if (!order.canBeCancelled()) {
    return next(new AppError('Esta orden no puede ser cancelada', 400));
  }

  const cancelled = order.cancel(reason);

  if (!cancelled) {
    return next(new AppError('No se pudo cancelar la orden', 400));
  }

  // Restaurar stock si el pago fue aprobado
  if (order.paymentInfo.status === 'approved') {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Orden cancelada correctamente',
    data: { order }
  });
});

// Obtener estadísticas de órdenes (Admin)
export const getOrderStats = catchAsync(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' }
      }
    }
  ]);

  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'approved' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats
    }
  });
});