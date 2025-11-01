import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Configurar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Configurar CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de seguridad
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  windowMs: process.env.NODE_ENV === 'development' ? 15 * 60 * 1000 : 60 * 60 * 1000, // 15 min en dev, 1 hora en prod
  message: 'Demasiadas peticiones desde esta IP, intenta nuevamente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.path === '/products' && req.method === 'GET') {
    console.log('🔍 Petición de productos detectada en middleware');
  }
  if (req.method === 'POST') {
    console.log('📝 POST REQUEST DETECTED:', req.path);
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ExoPet API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

// Middleware global de errores
app.use(globalErrorHandler);

// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 5002; // Forzar reinicio

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor ExoPet ejecutándose en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
    });

    // Errores no controlados
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION 💥 Cerrando servidor...');
      console.log(err.name, err.message);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      console.log('UNCAUGHT EXCEPTION 💥 Cerrando servidor...');
      console.log(err.name, err.message);
      process.exit(1);
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM recibido. Cerrando servidor...');
      server.close(() => console.log('💥 Proceso terminado!'));
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;