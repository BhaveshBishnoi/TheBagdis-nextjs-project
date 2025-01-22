import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0,
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one product image'],
  }],
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['ghee', 'honey', 'spices', 'oils', 'other'],
  },
  stock: {
    type: Number,
    required: [true, 'Please provide product stock'],
    min: 0,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  specifications: {
    type: Map,
    of: String,
  },
  weight: {
    type: Number,
    required: [true, 'Please provide product weight in grams'],
  },
  weightUnit: {
    type: String,
    enum: ['g', 'kg', 'ml', 'l'],
    required: true,
  },
}, {
  timestamps: true,
});

// Calculate average rating before saving
productSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
