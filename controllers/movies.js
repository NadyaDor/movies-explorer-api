const Movie = require('../models/movie');

const InvalidRequestErr = require('../errors/invalid-request-err'); // 400
const NoAccessErr = require('../errors/no-access-err'); // 403
const NotFoundErr = require('../errors/not-found-err'); // 404

const {
  WRONG_DATA,
  WRONG_MOVIE,
  ACCESS_DELETE,
} = require('../errors/errors-text');

// Покажет все сохраненные текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.json(movies);
    })
    .catch(next);
};

// Создает новый фильм
module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  Movie.create({ name, link, owner: req.user._id })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequestErr(WRONG_DATA));
      } else {
        next(err);
      }
    });
};

// Удаляет сохраненный фильм по id
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error(WRONG_MOVIE))
    .then((movie) => {
      if (!movie) {
        throw new NotFoundErr(WRONG_MOVIE);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new NoAccessErr(ACCESS_DELETE);
      }
      return Movie.deleteOne(movie).then(res.send(movie));
    })
    .catch(next);
};
