const mongoose = require('mongoose');
const BrandAsset = require('../Models/BrandAsset');

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/arohaninfotech';

async function clearBrandAssets() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing all brand assets...');
    const result = await BrandAsset.deleteMany({});
    console.log(`✓ Successfully deleted ${result.deletedCount} brand assets`);

    const remainingCount = await BrandAsset.countDocuments();
    console.log(`\nRemaining brand assets in database: ${remainingCount}`);

    await mongoose.disconnect();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearBrandAssets();
