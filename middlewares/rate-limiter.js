const rateLimiter = require('express-rate-limit');

module.exports.limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // Время в милисекундах
  max: 100, // Максимальное количество запросов за указанное время
  message: 'Превышено количество запросов. Попробуйте снова через 15 минут',
  headers: true, // Добавит заголовки в ответ
});
