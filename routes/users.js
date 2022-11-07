const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
  // GET & VIEW DATA
  router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      const url = req.url == '/' ? '/?page=1' : req.url
      const page = req.query.page || 1
      const limit = 3
      const offset = (page - 1) * limit
      let count = 1

      let sql = 'SELECT COUNT(*) AS total FROM public."usersAccount"'

      const data = await db.query(sql)
      console.log(data.rows, 'DATA')

      const pages = Math.ceil(data.rows[0].total / limit)
      console.log(pages, 'PAGES')

      sql = 'SELECT * FROM public."usersAccount"'
      sql += ` LIMIT $${count++} OFFSET $${count++}`

      const result = await db.query(sql, [limit, offset])
      console.log(result.rows, 'RESULT')

      res.render('userPages/users', { user: req.session.user, data: result.rows, query: req.query, pages, page, limit, offset, url });
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  });


  // ADD DATA
  router.get('/add', isLoggedIn, async (req, res, next) => {
    const data = await db.query('SELECT * FROM public."usersAccount"')

    res.render('userPages/add', { user: req.session.user, data: data.rows });
  });

  router.post('/add', isLoggedIn, async (req, res, next) => {
    try {
      const { email, name, password, role } = req.body
      const { rows: emails } = await db.query('SELECT * FROM public."usersAccount" WHERE email = $1', [email])
      if (emails.length > 0) {
        req.flash('error', `Email already exist`)
        return res.redirect('/add')
      }

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO public."usersAccount" (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])

      res.redirect('/users')
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  })

  // EDIT DATA
  router.get('/edit/:userid', isLoggedIn, async (req, res, next) => {
    const { userid } = req.params

    const { rows: data } = await db.query('SELECT * FROM public."usersAccount" WHERE userid = $1', [userid])

    res.render('userPages/edit', { user: req.session.user, item: data[0] });
  });

  router.post('/edit/:userid', isLoggedIn, async (req, res, next) => {
    try {
      const { userid } = req.params
      const { email, name, role } = req.body

      await db.query('UPDATE public."usersAccount" SET email = $1, name = $2, role = $3 WHERE userid = $4', [email, name, role, userid])

      res.redirect('/users')
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  })

  // DELETE DATA
  router.get('/delete/:userid', isLoggedIn, async (req, res, next) => {
    try {
      await db.query('DELETE FROM public."usersAccount" WHERE userid = $1', [req.params.userid])

      res.redirect('/users');
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  });
  return router;
}
