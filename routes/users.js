const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
  // GET & VIEW DATA
  router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      let sql = 'SELECT * FROM public."usersAccount"'

      const result = await db.query(sql)

      res.render('userPages/list', { user: req.session.user, data: result.rows, query: req.query, currentPage: 'POS - Users' });
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  })

  router.get('/datatable', async (req, res) => {
    let params = []

    if (req.query.search.value) {
      params.push(`email like '%' || '${req.query.search.value}' || '%'`)
    }
    if (req.query.search.value) {
      params.push(`name like '%' || '${req.query.search.value}' || '%'`)
    }

    const limit = req.query.length
    const offset = req.query.start
    const sortBy = req.query.columns[req.query.order[0].column].data
    const sortMode = req.query.order[0].dir

    const total = await db.query(`select count(*) as total from public."usersAccount"${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
    const data = await db.query(`select * from public."usersAccount"${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const response = {
      "draw": Number(req.query.draw),
      "recordsTotal": total.rows[0].total,
      "recordsFiltered": total.rows[0].total,
      "data": data.rows
    }
    res.json(response)
  })

  // ADD DATA
  router.get('/add', isLoggedIn, async (req, res, next) => {
    const data = await db.query('SELECT * FROM public."usersAccount"')

    res.render('userPages/add', { user: req.session.user, data: data.rows, currentPage: 'POS - Users' });
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
