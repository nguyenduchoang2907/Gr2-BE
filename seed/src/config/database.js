const { MongoClient } = require('mongodb');

// Kết nối đến MongoDB
const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017');

const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('gr2'); // Kết nối đến database 'gr2'
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;
