require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet'); // Улучшает безопасность приложения
const { errors } = require('celebrate');
const cors = require('cors'); // Разрешает запросы с других ресурсов

const { errorHandler } = require('./errors/error-handler'); // Централизованный обработчик ошибок
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // Мидлвар для хранения инф-ии об ошибках
const { limiter } = require('./middlewares/rate-limiter'); // Настроит макс кол-во запросов с одного IP
const { MONGO_DEV } = require('./utils/config');

const { NODE_ENV, MONGO_DB } = process.env;

const app = express();
app.use(cors());
app.use(requestLogger);
app.use(express.json()); // Парсинг JSON-запросов
app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : MONGO_DEV);

app.use(limiter);
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(3000);
