const router = require('express').Router();
const User = require('../db/User');
const bcrypt = require('bcryptjs');
// const userController = require('../controller/userController');

module.exports = router;

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

router.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1,
  });
  response.json(users);
});
