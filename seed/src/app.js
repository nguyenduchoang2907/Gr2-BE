const { insertFakeWords } = require('./services/wordService');

const generateAndInsertFakeWords = async (count) => {
  await insertFakeWords(count);
};

module.exports = { generateAndInsertFakeWords };
