const mongoose = require('mongoose');
const BrandAsset = require('../Models/BrandAsset');

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/arohaninfotech';

const sampleBrandAssets = [
  {
    name: 'Google',
    type: 'client-logo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    altText: 'Google',
    link: 'https://google.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Amazon',
    type: 'client-logo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    altText: 'Amazon',
    link: 'https://amazon.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Microsoft',
    type: 'client-logo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    altText: 'Microsoft',
    link: 'https://microsoft.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'HelpScout',
    type: 'client-logo',
    imageUrl: 'https://help.com/wp-content/themes/HelpScout/images/logo.svg',
    altText: 'HelpScout',
    link: 'https://helpscout.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 4,
  },
  {
    name: 'Optimizely',
    type: 'client-logo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Optimizely_logo.svg',
    altText: 'Optimizely',
    link: 'https://optimizely.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 5,
  },
  {
    name: 'Breezy',
    type: 'client-logo',
    imageUrl: 'https://www.breezy.hr/images/breezy-logo.svg',
    altText: 'Breezy',
    link: 'https://breezy.hr',
    page: 'portfolio',
    isActive: true,
    sortOrder: 6,
  },
  {
    name: 'Attio',
    type: 'client-logo',
    imageUrl: 'https://www.attio.com/_next/static/media/logo.4e57f0dc.svg',
    altText: 'Attio',
    link: 'https://attio.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 7,
  },
  {
    name: 'PayPal',
    type: 'client-logo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg',
    altText: 'PayPal',
    link: 'https://paypal.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 8,
  },
  {
    name: 'Particle',
    type: 'client-logo',
    imageUrl: 'https://www.particle.io/static/particle-logo.svg',
    altText: 'Particle',
    link: 'https://particle.io',
    page: 'portfolio',
    isActive: true,
    sortOrder: 9,
  },
  {
    name: 'HubSpot',
    type: 'client-logo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/65/HubSpot_Logo.svg',
    altText: 'HubSpot',
    link: 'https://hubspot.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 10,
  },
  {
    name: 'Miro',
    type: 'client-logo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Miro_Logo.svg',
    altText: 'Miro',
    link: 'https://miro.com',
    page: 'portfolio',
    isActive: true,
    sortOrder: 11,
  },
];

async function seedBrandAssets() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingCount = await BrandAsset.countDocuments({ type: 'client-logo' });
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing client logos. Clearing old data...`);
      await BrandAsset.deleteMany({ type: 'client-logo' });
    }

    // Insert sample data
    console.log('Seeding brand assets...');
    const result = await BrandAsset.insertMany(sampleBrandAssets);
    console.log(`✓ Successfully seeded ${result.length} brand assets`);

    // Display summary
    const totalCount = await BrandAsset.countDocuments();
    const activeCount = await BrandAsset.countDocuments({ isActive: true });
    console.log(`\nDatabase Summary:`);
    console.log(`  Total brand assets: ${totalCount}`);
    console.log(`  Active clients: ${activeCount}`);
    console.log(`  Client logos for portfolio: ${await BrandAsset.countDocuments({ type: 'client-logo', page: 'portfolio' })}`);

    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedBrandAssets();
