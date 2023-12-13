const router = require('express').Router();

const { createUser, login } = require('../controllers/users'); // Импорт контроллеров для входа и создания юзера
const userRoutes = require('./users'); // Импорт роутов для пользователя
const movieRoutes = require('./movies'); // Импорт роутов для фильмов
const auth = require('../middlewares/auth'); // Мидлвар для проверки JWT
const NotFoundErr = require('../errors/not-found-err'); // 404
const { NOT_FOUND } = require('../errors/errors-text');
const { createUserValidation, loginValidation } = require('../middlewares/data-validation');

// Незащищенные роуты для входа / регистрации
router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth); // защита роутов

router.use('/users', userRoutes); // Защищенные роуты для пользователей
router.use('/movies', movieRoutes); // Защищенные роуты для фильмов

router.use('*', () => {
  throw new NotFoundErr(NOT_FOUND);
});

module.exports = router;
