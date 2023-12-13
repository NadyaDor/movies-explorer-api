require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const InvalidRequestErr = require('../errors/invalid-request-err'); // 400
const UnauthorizedErr = require('../errors/unauthorized-err'); // 401
const NotFoundErr = require('../errors/not-found-err'); // 404
const ConflictErr = require('../errors/conflict-err'); // 409

const {
  USER_NOT_FOUND,
  WRONG_DATA,
  WRONG_EMAIL,
  WRONG_EMAIL_OR_PASS,
} = require('../errors/errors-text');

const { JWT_DEV } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

// Получает информацию о пользователе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr(USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch(next);
};

// Обновляет информацию о пользвателе
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr(USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictErr(WRONG_EMAIL));
      } else if (err.name === 'ValidationError') {
        next(new InvalidRequestErr(WRONG_DATA));
      } else {
        next(err);
      }
    });
};

// Регистрация нового пользователя
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictErr(WRONG_EMAIL));
      } else if (err.name === 'ValidationError') {
        next(new InvalidRequestErr(WRONG_DATA));
      } else {
        next(err);
      }
    });
};

// Вход в систему
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedErr(WRONG_EMAIL_OR_PASS);
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new UnauthorizedErr(WRONG_EMAIL_OR_PASS);
            } else {
              const token = jwt.sign(
                { _id: user._id },
                NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
                { expiresIn: '7d' },
              );
              res.status(200)
                .send({ token });
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};
