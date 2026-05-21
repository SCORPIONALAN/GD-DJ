import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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
  duration: {
    type: Number,
    min:  0,
  },
  category: {
    type: String,
    trim: true,
  },
  images: [
    {
      url:      { type: String, required: true },
      publicId: { type: String, required: true },
      isMain:   { type: Boolean, default: false },
    },
  ],
  isActive: {
    type:    Boolean,
    default: true,
  },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
