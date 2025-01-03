require('dotenv').config();
const express = require('express');
const app = express();

// Cấu hình CORS (Cross-Origin Resource Sharing) cho ứng dụng
const corsConfig = {
  // Cấu hình Access-Control-Allow-Origin: Chỉ cho phép các yêu cầu từ domain được xác định
  // Nếu môi trường không phải production, cho phép từ 'http://localhost:8888', 
  // ngược lại, lấy giá trị từ biến môi trường CORS_ORIGIN
  origin:
    app.get('env') !== 'production'
      ? 'http://localhost:8888'
      : process.env.CORS_ORIGIN,

  // Configures the Access-Control-Allow-Methods
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',

  // Cấu hình Access-Control-Allow-Headers: Cho phép các header cụ thể trong yêu cầu gửi đến server

  allowedHeaders:
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',

  // Cấu hình Access-Control-Expose-Headers: Cho phép các header cụ thể được đọc từ phản hồi
  credentials: true,

  //Configures the Access-Control-Expose-Headers
  exposedHeaders: 'Content-Range,X-Content-Range,Authorization',

  // Provides a status code to use for successful OPTIONS requests
  optionsSuccessStatus: 200,
};

module.exports = corsConfig;
