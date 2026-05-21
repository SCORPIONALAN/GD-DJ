import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  client: {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
  },
  service: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Service',
    required: true,
  },
  date: {
    type:     Date,
    required: true,
  },
  time: {
    type:     String,
    required: true,
  },
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
    type:      String,
    maxlength: 1000,
  },
  price: {
    type:     Number,
    required: true,
  },
  paymentStatus: {
    type:    String,
    enum:    ['unpaid', 'pending', 'paid', 'refunded'],
    default: 'unpaid',
  },
  paymentId: {
    type: String,
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
