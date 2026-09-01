const mongoose = require('mongoose');

const BrandAssetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['logo', 'icon', 'banner', 'client-logo', 'gallery'],
      required: true,
      default: 'logo',
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
    page: {
      type: String,
      enum: ['portfolio', 'company', 'home', 'all'],
      default: 'portfolio',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const BrandAsset = mongoose.model('BrandAsset', BrandAssetSchema);
module.exports = BrandAsset;
