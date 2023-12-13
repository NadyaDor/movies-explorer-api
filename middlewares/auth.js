const jwt = require('jsonwebtoken');

const UnauthorizedErr = require('../errors/unauthorized-err'); // 401
const { NEED_AUTH } = require('../errors/errors-text');
const { JWT_DEV } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // Проверяет есть ли и начинается заголовок с баер
  const { authorization } = req.headers;

  // если нет, то вызовет некст
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedErr(NEED_AUTH));
  }

  // если формат совпадает, то извлекается токен, удаляется баер
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // дальше пытается верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV);
  } catch (err) {
    // если возникает ошибка, то вызывается некст для повторного прохождения авторизации
    return next(new UnauthorizedErr(NEED_AUTH));
  }

  // если токен действителен, то расшифровка сохраняется здесь и продолжается обработка запроса
  req.user = payload;
  return next();
};
