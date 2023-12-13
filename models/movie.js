const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Введите страну происхождения'],
  },
  director: {
    type: String,
    required: [true, 'Введите имя режисера фильма'],
  },
  duration: {
    type: Number,
    required: [true, 'ВВедите продолжительность фильма в минутах'],
  },
  year: {
    type: String,
    required: [true, 'Введите код выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'Напишите о чём фильм'],
  },
  image: {
    type: String,
    required: [true, 'Введите URL-адрес на постер к фильму'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Введен некорректный URL-адрес',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Введите URL-адрес на трейлер к фильму'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Введен некорректный URL-адрес',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Введите URL-адрес на постер к фильму'],
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Введен некорректный URL-адрес',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле должно быть заполнено'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
    unique: true, // Убедится, что айди уникален
    validate: {
      validator: Number.isInteger, // Проверяет, что это целое число
      message: 'movieId должен быть целым числом',
    },
  },
  nameRU: {
    type: String,
    required: [true, 'Введите название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'Введите название фильма на английском языке'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
