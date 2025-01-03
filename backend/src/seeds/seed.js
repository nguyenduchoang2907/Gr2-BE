const axios = require('axios');
const { MongoClient } = require('mongodb');

async function fetchAndSaveWord(word) {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('engish');
  const wordsCollection = db.collection('words');

  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const wordData = response.data[0];

    const entry = {
      word: wordData.word,
      mean: wordData.meanings.map((m) => m.definitions[0].definition).join('; '),
      type: wordData.meanings[0].partOfSpeech,
      phonetic: wordData.phonetics[0]?.text || '',
      examples: wordData.meanings[0].definitions[0].example
        ? [wordData.meanings[0].definitions[0].example]
        : [],
      synonyms: wordData.meanings[0].synonyms || [],
      antonyms: wordData.meanings[0].antonyms || [],
      picture: '', // Có thể dùng thư viện hình ảnh để gắn ảnh phù hợp
      specialty: '0',
      topics: [],
      note: '',
      isChecked: false,
      __v: 0,
    };

    await wordsCollection.insertOne(entry);
    console.log(`Saved word: ${word}`);
  } catch (error) {
    console.error(`Error fetching word: ${word}`, error);
  } finally {
    await client.close();
  }
}

fetchAndSaveWord('cat'); // Gọi hàm với từ bạn muốn thêm vào
