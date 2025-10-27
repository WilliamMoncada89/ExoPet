import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const createNormalUser = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Datos del usuario normal
    const userData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      password: 'usuario123',
      phone: '+56912345678',
      dateOfBirth: new Date('1995-03-15'),
      gender: 'male',
      role: 'user', // Rol de usuario normal
      isActive: true,
      isEmailVerified: true
    };

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('⚠️ El usuario ya existe con este email');
      process.exit(1);
    }

    // Crear usuario (la contraseña se encriptará automáticamente por el middleware del modelo)
    const newUser = await User.create(userData);

    console.log('✅ Usuario normal creado exitosamente!');
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🔑 Contraseña: usuario123`);
    console.log(`👤 Rol: ${newUser.role}`);
    console.log(`📱 Teléfono: ${userData.phone}`);
    console.log('');
    console.log('🎉 Usuario creado exitosamente!');

  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Ejecutar función
createNormalUser();