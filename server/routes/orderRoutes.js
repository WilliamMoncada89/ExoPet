import express from 'express';
import {
  createOrder,
  confirmPayment,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para invitados)
router.post('/', optionalAuth, createOrder);
router.post('/confirm-payment', confirmPayment);

// Rutas protegidas
router.use(protect);

router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

// Rutas de administrador
router.use(restrictTo('admin'));
router.get('/', getAllOrders);
router.get('/stats/overview', getOrderStats);
router.patch('/:id/status', updateOrderStatus);

export default router;