require('dotenv').config({ path: './config.env' });

const MONGO_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URI.replace('<password>', process.env.DB_PASSWORD)
    : process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);
const PORT = process.env.PORT;

module.exports = {
  MONGO_URL,
  PORT,
};
