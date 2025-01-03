const axios = require('axios');
const { MongoClient } = require('mongodb');

async function fetchAndSaveWord(word) {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('english');
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
fetchAndSaveWord('computer');
fetchAndSaveWord('table');
fetchAndSaveWord('chair');
fetchAndSaveWord('phone');
fetchAndSaveWord('keyboard');
fetchAndSaveWord('mouse');
fetchAndSaveWord('laptop');
fetchAndSaveWord('television');
fetchAndSaveWord('radio');
fetchAndSaveWord('internet');
fetchAndSaveWord('website');
fetchAndSaveWord('application');
fetchAndSaveWord('programming');
fetchAndSaveWord('developer');
fetchAndSaveWord('software');
fetchAndSaveWord('hardware');
fetchAndSaveWord('server');
fetchAndSaveWord('database');
fetchAndSaveWord('cloud');
fetchAndSaveWord('security');
