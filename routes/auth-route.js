const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user-model')
const bcrypt = require('bcrypt')

router.get('/login', (req, res) => {
  res.render('login', { user: req.user })
})

router.get('/signup', (req, res) => {
  res.render('signup', { user: req.user })
})

router.post('/signup', async (req, res) => {
  console.log(req.body)
  let { name, email, password } = req.body
  const emailExist = await User.findOne({ email })
  if (emailExist) {
    req.flash('error_msg', '這個Email已經註冊過了')
    res.redirect('/auth/signup')
  } else {
    const hash = await bcrypt.hash(password, 10)
    password = hash
    const newUser = new User({ name, email, password })
    try {
      await newUser.save()
      req.flash('success_msg', '註冊成功了')
      res.redirect('/auth/login')
    } catch (err) {
      req.flash('error_msg', err.errors.name.properties.message)
      res.redirect('/auth/signup')
    }
  }
})

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: '帳號或密碼錯誤'
  })
)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
  })
)

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile')
})

module.exports = router
