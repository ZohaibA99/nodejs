const express = require('express')
const path = require('path');
const passport = require('passport')
const cors = require('cors')
const routerApi = require('./api')
const mongoose = require('mongoose')
const usersRouter = require('./user.js')
const multer = require('multer')
const fs = require('fs').promises;
const app = express()

const uploadDir = path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576, // 1MB limit
  },
});

const upload = multer({
  storage: storage,
});

app.use(upload.single('avatar'));

app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')))

// parse application/json
app.use(express.json())

// cors
app.use(cors())

mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_HOST)

require('./config/config-passport')

app.use('/api', routerApi)

app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRouter);

// catch 404 and forward to error handler
app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: `Use api on routes: 
    /api/registration - registration user {username, email, password}
    /api/login - login {email, password}
    /api/list - get message if user is authenticated`,
    data: 'Not found',
  })
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  })
})

const isAccessible = path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  createFolderIsNotExist(uploadDir);
  console.log(`Server running. Use our API on port: ${PORT}`)
})
