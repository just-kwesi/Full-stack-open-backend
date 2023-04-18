const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

require('express-async-errors');

const logger = require('../utils/logger');
const config = require('../utils/config');
const middleware = require('../utils/middleware');

// DB Connection

const url = config.MONGO_URL;
mongoose.set('strictQuery', false);
mongoose
  .connect(url)
  .then(() => logger.info(`db connection successful`))
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

const app = express();

// allow Cross-orign resource saring(CORS)
app.use(cors());

// body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/api', require('./routes'));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
