const router = require('express').Router();

router.use('/notes', require('./notes'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./testing');
  router.use('/testing', testingRouter);
}

router.use((req, res, next) => {
  const err = new Error('Page Not Found!');
  next(err);
});

module.exports = router;
