import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [orderItemSchema],
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'cod'],
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  deliveredAt: Date,
  trackingNumber: String,
  trackingUrl: String,
  notes: String,
}, {
  timestamps: true,
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  this.itemsPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  this.taxPrice = this.itemsPrice * 0.18; // 18% GST
  this.shippingPrice = this.itemsPrice > 1000 ? 0 : 100; // Free shipping over ₹1000
  this.totalAmount = this.itemsPrice + this.taxPrice + this.shippingPrice;
  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
