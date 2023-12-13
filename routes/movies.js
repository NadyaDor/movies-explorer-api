const router = require('express').Router();
const MovieController = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/data-validation');

// Роут для получения всех сохраненных текущим пользователем фильмов
router.get('/movies', MovieController.getMovies);

// Роут для создания нового фильма
router.post('/movies', createMovieValidation, MovieController.createMovie);

// Роут для удаления фильма по его идентификатору
router.delete('/movies/:id', deleteMovieValidation, MovieController.deleteMovie);

module.exports = router;
