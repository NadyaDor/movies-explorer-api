const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Введите адрес вашей электронной почты'],
    unique: [true, 'Этот адрес уже используется, выберете другой'],
    trim: true, // Удалит лишние пробелы в начале и конце строки
    lowercase: true, // Преобразует в нижний регистр
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен некорректный email-адрес, попробуйте ещё раз',
    },
  },
  password: {
    type: String,
    required: [true, 'Введите пароль'],
    select: false, // Не будет возвращать это поле при выборке
  },
  name: {
    type: String,
    required: [true, 'Введите ваше имя'],
    minlength: [2, 'Минимальное количество символов - 2'],
    maxlength: [30, 'Максимальное количество символов - 30'],
  },
});

module.exports = mongoose.model('user', userSchema);
