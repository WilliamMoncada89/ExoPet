import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Configurar variables de entorno
dotenv.config();

// Datos del usuario administrador por defecto
const adminUser = {
  firstName: 'William',
  lastName: 'Moncada',
  email: 'william.moncada1133@gmail.com',
  password: 'inacap8933',
  phone: '+56964082043',
  dateOfBirth: new Date('2001-06-04'),
  gender: 'male', // Convertido de "hombre" a valor válido del enum
  role: 'admin',
  isActive: true,
  isEmailVerified: true,
  preferences: {
    newsletter: false,
    promotions: false,
    language: 'es',
    currency: 'CLP'
  }
};

const seedAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('⚠️ Ya existe un usuario administrador con el email:', adminUser.email);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nombre:', existingAdmin.firstName, existingAdmin.lastName);
      console.log('🔑 Rol:', existingAdmin.role);
      process.exit(0);
    }

    // Crear usuario administrador
    const newAdmin = await User.create(adminUser);
    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('📧 Email:', newAdmin.email);
    console.log('🔑 Contraseña temporal: admin123456');
    console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer login');
    
    console.log('\n🎉 Administrador creado exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error.message);
    process.exit(1);
  }
};

// Función para crear un admin personalizado
const createCustomAdmin = async (adminData) => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email: adminData.email });
    
    if (existingUser) {
      console.log('⚠️ Ya existe un usuario con el email:', adminData.email);
      process.exit(1);
    }

    // Crear usuario administrador personalizado
    const newAdmin = await User.create({
      ...adminData,
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });

    console.log('✅ Usuario administrador personalizado creado exitosamente!');
    console.log('📧 Email:', newAdmin.email);
    console.log('👤 Nombre:', newAdmin.firstName, newAdmin.lastName);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuario administrador personalizado:', error.message);
    process.exit(1);
  }
};

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === 'custom') {
  // Ejemplo de uso para crear admin personalizado
  // node seedAdmin.js custom
  console.log('Para crear un admin personalizado, modifica el script con los datos deseados');
  process.exit(0);
} else {
  // Ejecutar script por defecto
  seedAdmin();
}

export { createCustomAdmin };