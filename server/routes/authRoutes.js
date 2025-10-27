import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyToken,
  createAdmin,
  getAllUsers,
  updateUserRole
} from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Rutas protegidas (requieren autenticación)
router.use(protect); // Todas las rutas después de esta línea están protegidas

router.get('/verify', verifyToken);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);

// Rutas solo para administradores
router.use(restrictTo('admin')); // Solo admins pueden acceder a estas rutas

router.post('/create-admin', createAdmin);
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', updateUserRole);

export default router;