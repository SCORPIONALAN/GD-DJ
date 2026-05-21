import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  rating: {
    type:     Number,
    required: true,
    min:      1,
    max:      5,
  },
  comment: {
    type:      String,
    required:  true,
    maxlength: 2000,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'Service',
  },
  status: {
    type:    String,
    enum:    ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
