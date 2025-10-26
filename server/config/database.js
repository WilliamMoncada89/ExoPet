import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Crear índices para optimización
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Índices para productos
    await mongoose.connection.db.collection('products').createIndex({ category: 1 });
    await mongoose.connection.db.collection('products').createIndex({ subcategory: 1 });
    await mongoose.connection.db.collection('products').createIndex({ name: 'text', description: 'text' });
    
    // Índices para órdenes
    await mongoose.connection.db.collection('orders').createIndex({ userId: 1 });
    await mongoose.connection.db.collection('orders').createIndex({ status: 1 });
    await mongoose.connection.db.collection('orders').createIndex({ createdAt: -1 });
    
    // Índices para usuarios
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    console.log('✅ Índices de base de datos creados');
  } catch (error) {
    console.log('⚠️ Algunos índices ya existen o hubo un error:', error.message);
  }
};

export default connectDB;