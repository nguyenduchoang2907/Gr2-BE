const axios = require('axios');

const fetchWordData = async (word) => {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.data[0];
  } catch (error) {
    console.error(`Failed to fetch data for word: ${word}`, error.message);
    throw error;
  }
};

module.exports = { fetchWordData };
