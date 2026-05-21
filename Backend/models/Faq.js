import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type:      String,
    required:  true,
    maxlength: 500,
    trim:      true,
  },
  answer: {
    type:     String,
    required: true,
  },
  category: {
    type:    String,
    default: 'general',
    trim:    true,
  },
  order: {
    type:    Number,
    default: 0,
  },
  isActive: {
    type:    Boolean,
    default: true,
  },
}, { timestamps: true });

const Faq = mongoose.model('Faq', faqSchema);

export default Faq;
