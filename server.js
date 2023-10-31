const express = require('express')
const path = require('path')
//nodmailer package
// const nodemailer = require('nodemailer')
//sendgrid package
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res, next) => {
  res.render('index')
})

//sendgrid post request
app.post('/', async (req, res, next) => {
    const {email, name, text} = req.body;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: email,
        from: "zohaibATest1@outlook.com",
        subject: `test`,
        text
      };
      try {
        await sgMail.send(msg);
        res.render("done");
      } catch (err) {
        next(err);
      }
})

//nodemailer post request
// app.post('/', (req, res, next) => {
//   const { email, name, text } = req.body
//   const config = {
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'zohaibATest1@outlook.com',
//       pass: process.env.PASSWORD,
//     },
//   }

//   const transporter = nodemailer.createTransport(config)
//   const emailOptions = {
//     from: 'zohaibATest1@outlook.com',
//     to: email,
//     subject: 'Nodemailer test',
//     text: `this is a test email`,
//   }

//   transporter
//     .sendMail(emailOptions)
//     .then((info) => console.log(info))
//     .catch((err) => next(err))
// })

app.use(function (req, res, next) {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

const port = process.env.PORT || '3000'
app.listen(port, () => {
  console.log('Server start')
})