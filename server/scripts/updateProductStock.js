import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const updateProductStock = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener todos los productos
    const products = await Product.find({});
    console.log(`📦 Encontrados ${products.length} productos`);

    // Actualizar productos que no tienen stock definido
    const updatePromises = products.map(async (product) => {
      if (product.stock === undefined || product.stock === null) {
        // Asignar stock aleatorio basado en la categoría
        let stockRange;
        
        switch (product.category?.toLowerCase()) {
          case 'alimentos':
            stockRange = { min: 15, max: 50 }; // Alimentos tienen más stock
            break;
          case 'accesorios':
            stockRange = { min: 8, max: 25 };
            break;
          case 'juguetes':
            stockRange = { min: 5, max: 20 };
            break;
          case 'cuidado':
            stockRange = { min: 10, max: 30 };
            break;
          case 'habitat':
            stockRange = { min: 3, max: 15 }; // Hábitats son más especializados
            break;
          default:
            stockRange = { min: 5, max: 25 };
        }

        // Generar stock aleatorio dentro del rango
        const randomStock = Math.floor(Math.random() * (stockRange.max - stockRange.min + 1)) + stockRange.min;
        
        // Actualizar el producto
        await Product.findByIdAndUpdate(product._id, { 
          stock: randomStock,
          isActive: true // Asegurar que esté activo
        });
        
        console.log(`📦 ${product.name}: Stock actualizado a ${randomStock}`);
        return { name: product.name, stock: randomStock };
      } else {
        console.log(`✅ ${product.name}: Ya tiene stock (${product.stock})`);
        return { name: product.name, stock: product.stock, existing: true };
      }
    });

    const results = await Promise.all(updatePromises);
    
    // Mostrar resumen
    const updated = results.filter(r => !r.existing);
    const existing = results.filter(r => r.existing);
    
    console.log('\n📊 RESUMEN:');
    console.log(`✅ Productos actualizados: ${updated.length}`);
    console.log(`📦 Productos que ya tenían stock: ${existing.length}`);
    
    if (updated.length > 0) {
      console.log('\n🔄 PRODUCTOS ACTUALIZADOS:');
      updated.forEach(item => {
        console.log(`  • ${item.name}: ${item.stock} unidades`);
      });
    }

    // Verificar el estado final
    const finalProducts = await Product.find({});
    const withStock = finalProducts.filter(p => p.stock > 0);
    const withoutStock = finalProducts.filter(p => p.stock === 0);
    
    console.log('\n📈 ESTADO FINAL:');
    console.log(`🟢 Productos con stock: ${withStock.length}`);
    console.log(`🔴 Productos sin stock: ${withoutStock.length}`);
    
    console.log('\n✅ Actualización de stock completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error actualizando stock:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar el script
updateProductStock();