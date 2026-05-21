import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type:      String,
    required:  true,
    maxlength: 200,
    trim:      true,
  },
  description: {
    type: String,
  },
  price: {
    type:     Number,
    required: true,
    min:      0,
  },
  images: [
    {
      url:      { type: String, required: true },
      publicId: { type: String, required: true },
      isMain:   { type: Boolean, default: false },
    },
  ],
  category: {
    type: String,
    trim: true,
  },
  stock: {
    type:    Number,
    default: 0,
    min:     0,
  },
  isActive: {
    type:    Boolean,
    default: true,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
