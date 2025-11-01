import express from 'express';
import {
  getAllProducts,
  getProductById,
  getCategories,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  checkStock
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// 🔹 Rutas públicas
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.post('/check-stock', checkStock);
router.get('/:id', getProductById);

// 🔹 Rutas protegidas (Admin)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;