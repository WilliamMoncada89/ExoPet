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
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
  max: 100, // límite de requests por IP
  windowMs: 60 * 60 * 1000, // 1 hora
  message: 'Demasiadas peticiones desde esta IP, intenta nuevamente en una hora.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (simple console logging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ExoPet API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Ruta para manejar rutas no encontradas
app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Conectar a MongoDB y iniciar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor ExoPet ejecutándose en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`💳 Transbank: ${process.env.TRANSBANK_ENVIRONMENT}`);
    });

    // Manejo de errores no capturados
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Cerrando servidor...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (err) => {
      console.log('UNCAUGHT EXCEPTION! 💥 Cerrando servidor...');
      console.log(err.name, err.message);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Cerrando servidor gracefully...');
      server.close(() => {
        console.log('💥 Proceso terminado!');
      });
    });

  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

export default app;