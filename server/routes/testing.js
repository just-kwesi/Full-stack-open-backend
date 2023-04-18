const testingRouter = require('express').Router();
const Note = require('../db/Notes');
const User = require('../db/User');

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = testingRouter;
