const router = require('express').Router();
const UserController = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/data-validation');

// Роут для получения информации о пользователе
router.get('/me', UserController.getUser);

// Роут для обновления информации о пользователе
router.patch('/me', updateUserValidation, UserController.updateUser);

module.exports = router;
