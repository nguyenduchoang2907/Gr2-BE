const faker = require('faker');

const generateFakeWordData = () => ({
  word: faker.random.word(),
  picture: faker.image.imageUrl(640, 480, 'animals', true),
  specialty: '0',
  topics: [],
  note: '',
  isChecked: false,
  __v: 0,
});

module.exports = { generateFakeWordData };
