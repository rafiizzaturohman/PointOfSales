var express = require('express');
const bcrypt = require('bcrypt');

const saltRounds = 10;
var router = express.Router();

module.exports = (db) => {
  // LOGIN
  router.get('/', (req, res, next) => {
    res.render('login');
  });

  router.post('/', async (req, res) => {
    try {
      const { email, password } = req.body
      const { rows: emails } = await db.query('SELECT * FROM public."usersAccount" WHERE email = $1', [email])

      if (emails.length == 0) return res.send(`Email does'nt exist`)
      if (!bcrypt.compareSync(password, emails[0].password)) return res.send("Password does'nt match")

      res.redirect('/home')
    } catch (error) {
      console.log(error)
      res.send(error)
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
      if (emails.length > 0) return res.send(`Email already exist`)

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO public."usersAccount" (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])

      res.redirect('/')
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  })

  // HOME
  router.get('/home', (req, res, next) => {
    res.render('page/home');
  });
  return router;
}