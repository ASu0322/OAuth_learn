require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoute = require('./routes/auth-route')
const profileRoute = require('./routes/profile-route')
require('./config/passport')
const passport = require('passport')
require('https').globalAgent.options.rejectUnauthorized = false
const session = require('express-session')
const flash = require('connect-flash')

// middleware
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})
app.use('/auth', authRoute)
app.use('/profile', profileRoute)

mongoose.set('strictQuery', false)
// connect to mongoDB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Connection Failed')
    console.log(err)
  })

app.get('/', (req, res) => {
  res.render('index', { user: req.user })
})

app.get('/*', (req, res) => {
  res.status(404).send('這是404 Page')
})

// error handler
app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('系統發生錯誤，我們將盡快處理')
})

app.listen(3000, () => {
  console.log('連接到3000')
})
