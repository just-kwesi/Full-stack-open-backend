const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../db/User');
const router = require('express').Router();

module.exports = router;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password',
    });
  }

  const userToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(userToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  res.status(200).json({
    token,
    username: user.username,
    name: user.name,
  });
});
