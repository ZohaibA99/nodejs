const express = require('express')
const gravatar = require('gravatar')
const multer = require('multer');
const jimp = require('jimp');
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../user')
require('dotenv').config()
const secret = process.env.SECRET

const upload = multer({ dest: 'tmp/' });

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: 'Unauthorized',
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Incorrect login or password',
      data: 'Bad request',
    })
  }

  const payload = {
    id: user.id,
    username: user.username,
  }

  const token = jwt.sign(payload, secret, { expiresIn: '1h' })
  res.json({
    status: 'success',
    code: 200,
    data: {
      token,
    },
  })
})

router.post('/registration', async (req, res, next) => {
  const { username, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'Email is already in use',
      data: 'Conflict',
    })
  }
  try {
    const avatarURL = gravatar.url(email, {s: 500, d: 'mm'})
    const newUser = new User({ username, email, avatarURL })
    newUser.setPassword(password)
    await newUser.save()
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        message: 'Registration successful',
      },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/list', auth, (req, res, next) => {
  const { username } = req.user
  res.json({
    status: 'success',
    code: 200,
    data: {
      message: `Authorization was successful: ${username}`,
    },
  })
})

router.patch('/avatars', upload.single('avatar'), async (req, res, next) => {
  const { user } = req;
  try {
    console.log('updating avatar')
    const avatar = await jimp.read(req.file.path);
    await avatar.resize(500, 500);
    const uniqueFileName = `${user.id}-${Date.now()}-${req.file.originalname}`;
    await avatar.write(`public/avatars/${uniqueFileName}`);

    // Update user's avatarURL field
    user.avatarURL = `/avatars/${uniqueFileName}`;
    await user.save();

    res.json({
      avatarURL: user.avatarURL,
    });
    console.log('avater added')
  } catch (error) {
    next(error);
  }
});

module.exports = router
