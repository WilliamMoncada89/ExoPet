import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const checkProductStock = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar el producto "Cueva de Musgo Natural"
    const product = await Product.findOne({ 
      name: { $regex: /cueva.*musgo.*natural/i } 
    });

    if (product) {
      console.log('\n📦 PRODUCTO ENCONTRADO:');
      console.log(`ID: ${product._id}`);
      console.log(`Nombre: ${product.name}`);
      console.log(`Stock: ${product.stock}`);
      console.log(`Precio: $${product.price}`);
      console.log(`Categoría: ${product.category}`);
      console.log(`Activo: ${product.isActive}`);
      console.log(`Disponible: ${product.isAvailable ? 'Sí' : 'No'}`);
      
      // Verificar método isAvailable
      console.log('\n🔍 VERIFICACIÓN DE DISPONIBILIDAD:');
      console.log(`¿Disponible para 1 unidad? ${product.isAvailable(1)}`);
      console.log(`¿Disponible para 2 unidades? ${product.isAvailable(2)}`);
      console.log(`¿Disponible para ${product.stock} unidades? ${product.isAvailable(product.stock)}`);
      console.log(`¿Disponible para ${product.stock + 1} unidades? ${product.isAvailable(product.stock + 1)}`);
    } else {
      console.log('❌ Producto "Cueva de Musgo Natural" no encontrado');
      
      // Buscar productos similares
      const similarProducts = await Product.find({
        name: { $regex: /cueva|musgo|natural/i }
      }).limit(5);
      
      if (similarProducts.length > 0) {
        console.log('\n🔍 PRODUCTOS SIMILARES ENCONTRADOS:');
        similarProducts.forEach(p => {
          console.log(`- ${p.name} (Stock: ${p.stock})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar el script
checkProductStock();