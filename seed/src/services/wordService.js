const { generateFakeWordData } = require('../utils/faker');
const connectDB = require('../config/database');

const insertFakeWords = async (count) => {
  const db = await connectDB();
  const wordsCollection = db.collection('word'); // Truy cập vào collection 'word' trong database 'gr2'

  for (let i = 0; i < count; i++) {
    const fakeWordData = generateFakeWordData();
    try {
      await wordsCollection.insertOne(fakeWordData);
      console.log(`Inserted word: ${fakeWordData.word}`);
    } catch (error) {
      console.error('Error inserting word:', error);
    }
  }
};

module.exports = { insertFakeWords };
