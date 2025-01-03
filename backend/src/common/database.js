const mongoose = require('mongoose');
require('dotenv').config();  // Đọc biến môi trường từ file .env

module.exports = () => {
  const mongoUrl = process.env.MONGO_URL_LOCAL || 'mongodb://127.0.0.1:27017/english';  // Dùng biến môi trường
  mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));
  return mongoose;
};
