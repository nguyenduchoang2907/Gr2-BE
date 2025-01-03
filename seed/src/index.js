const { generateAndInsertFakeWords } = require('./app');

// Số lượng từ cần tạo và thêm vào MongoDB
const main = async () => {
  await generateAndInsertFakeWords(10); // Tạo và thêm 10 từ giả vào MongoDB
};

main();
