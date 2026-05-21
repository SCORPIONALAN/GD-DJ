import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  key: {
    type:      String,
    required:  true,
    unique:    true,
    uppercase: true,
    trim:      true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
  group: {
    type:    String,
    enum:    ['general', 'social', 'pagos'],
    default: 'general',
  },
  isPublic: {
    type:    Boolean,
    default: false,
  },
}, { timestamps: true });

const Config = mongoose.model('Config', configSchema);

export default Config;
