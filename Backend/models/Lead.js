import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type:      String,
    required:  true,
    maxlength: 100,
    trim:      true,
  },
  email: {
    type:      String,
    required:  true,
    lowercase: true,
    trim:      true,
  },
  phone: {
    type: String,
    trim: true,
  },
  message: {
    type:      String,
    maxlength: 2000,
  },
  source: {
    type:    String,
    default: 'web',
    trim:    true,
  },
  status: {
    type:    String,
    enum:    ['new', 'contacted', 'converted', 'lost'],
    default: 'new',
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
