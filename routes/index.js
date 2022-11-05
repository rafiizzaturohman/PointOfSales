const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
  // LOGIN
  router.get('/', (req, res, next) => {
    res.render('login', {
      success: req.flash('success'),
      error: req.flash('error')
    });
  });

  router.post('/', async (req, res) => {
    try {
      const { email, password } = req.body
      const { rows: emails } = await db.query('SELECT * FROM public."usersAccount" WHERE email = $1', [email])

      if (emails.length == 0) {
        req.flash('error', `User doesn't exist`)
        return res.redirect('/')
      }

      if (!bcrypt.compareSync(password, emails[0].password)) {
        req.flash('error', 'Wrong Password')
        return res.redirect('/')
      }

      // Create a session
      const user = emails[0]
      delete user['password']

      req.session.user = user

      res.redirect('/home')
    } catch (error) {
      req.flash(error, '>err<')
      res.redirect('/')
    }
  })

  // REGISTER
  router.get('/register', (req, res, next) => {
    res.render('register');
  });

  router.post('/register', async (req, res) => {
    try {
      const { email, name, password, role } = req.body
      const { rows: emails } = await db.query('SELECT * FROM public."usersAccount" WHERE email = $1', [email])
      if (emails.length > 0) {
        req.flash('error', `Email already exist`)
        return res.redirect('/')
      }

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO public."usersAccount" (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])

      res.redirect('/')
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  })

  // HOME
  router.get('/home', isLoggedIn, async (req, res, next) => {
    res.render('page/home', { user: req.session.user });
  });

  // router.get('/nav', (req, res, next) => {
  //   res.render('partials/side', { user: req.session.user });
  // });

  router.get('/logout', (req, res, next) => {
    req.session.destroy(function (err) {
      res.redirect('/')
    });
  });

  return router;
}