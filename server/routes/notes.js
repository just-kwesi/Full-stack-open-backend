const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Note = require('../db/Notes');
const User = require('../db/User');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);

  note ? res.status(200).json(note) : res.status(404).end();
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndRemove(id);

  res.status(204).end();
});

//POSTING NEW NOTES RESEARVED FOR LOGGED IN USERS

const getTokenFrom = (req) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

router.post('/', async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token invalid',
    });
  }

  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

router.put('/:id', async (request, response) => {
  const { content, important } = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  );

  response.json(updatedNote);
});
