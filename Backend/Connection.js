const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URL;

mongoose.set('strictQuery', true);

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection failed', err));
