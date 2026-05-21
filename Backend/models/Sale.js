import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  items: [
    {
      product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:      { type: String, required: true },
      quantity:  { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true, min: 0 },
    },
  ],
  client: {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
  },
  total: {
    type:     Number,
    required: true,
    min:      0,
  },
  status: {
    type:    String,
    enum:    ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type:    String,
    enum:    ['mercadopago', 'cash', 'transfer', 'other'],
    default: 'other',
  },
  paymentId: {
    type: String,
  },
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;
