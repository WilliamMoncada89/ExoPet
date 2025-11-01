import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'La dirección es requerida'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'La ciudad es requerida'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'La región es requerida'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'El código postal es requerido'],
    trim: true
  },
  country: {
    type: String,
    default: 'Chile',
    trim: true
  }
});

const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['webpay', 'oneclick', 'transfer'],
    default: 'webpay'
  },
  transactionId: String,
  authorizationCode: String,
  cardType: String,
  cardNumber: String, // Solo últimos 4 dígitos
  installments: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'nullified'],
    default: 'pending'
  },
  transactionDate: Date,
  amount: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Permitir órdenes de invitados
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentInfo: paymentInfoSchema,
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// Generar número de orden único
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Buscar el último número de orden del día
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^EXO${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `EXO${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Índices
// Eliminar índice duplicado ya que unique: true en el schema ya crea el índice
// orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.email': 1 });

// Métodos virtuales
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered';
});

orderSchema.virtual('isPaid').get(function() {
  return this.paymentInfo && this.paymentInfo.status === 'approved';
});

// Métodos de instancia
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

orderSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
};

orderSchema.methods.cancel = function(reason) {
  if (this.canBeCancelled()) {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    this.cancelReason = reason;
    return true;
  }
  return false;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;