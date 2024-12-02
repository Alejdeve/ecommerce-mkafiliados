const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  ageRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  category: {
    type: String,
    required: true
  },
  affiliateInfo: {
    vendor: {
      type: String,
      required: true
    },
    commission: {
      type: Number,
      required: true
    },
    externalUrl: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);