const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
  // GET & VIEW DATA
  router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      res.render('userPages/list', {
        user: req.session.user, query: req.query, currentPage: 'POS - Users', success: req.flash('success'), error: req.flash('error')
      });
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
    res.render('userPages/add', { user: req.session.user, currentPage: 'POS - Users', success: req.flash('success'), error: req.flash('error') });
  });

  router.post('/add', isLoggedIn, async (req, res, next) => {
    try {
      const { email, name, password, role } = req.body
      const { rows: emails } = await db.query('SELECT * FROM public."usersAccount" WHERE email = $1', [email])

      if (emails.length > 0) {
        throw 'User already exist'
      }

      const hash = bcrypt.hashSync(password, saltRounds)

      await db.query('INSERT INTO public."usersAccount" (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])
      req.flash('success', 'Account was created successfully')

      res.redirect('/users')
    } catch (error) {
      req.flash('error', 'Email already exists')
      res.redirect('/users/add')
    }
  })

  // EDIT DATA
  router.get('/edit/:userid', isLoggedIn, async (req, res, next) => {
    try {
      const { userid } = req.params

      const { rows: data } = await db.query('SELECT * FROM public."usersAccount" WHERE userid = $1', [userid])

      res.render('userPages/edit', { user: req.session.user, item: data[0], currentPage: 'POS - Users', success: req.flash('success'), error: req.flash('error') });
    } catch (error) {
      console.log(err)
    }
  });

  router.post('/edit/:userid', isLoggedIn, async (req, res, next) => {
    try {
      const { userid } = req.params
      const { email, name, role } = req.body

      await db.query('UPDATE public."usersAccount" SET email = $1, name = $2, role = $3 WHERE userid = $4', [email, name, role, userid])
      req.flash('success', 'User information updated')

      res.redirect('/users')
    } catch (error) {
      req.flash('error', 'User information failed to update')
      console.log(error)
    }
  })

  // DELETE DATA
  router.get('/delete/:userid', isLoggedIn, async (req, res, next) => {
    try {
      await db.query('DELETE FROM public."usersAccount" WHERE userid = $1', [req.params.userid])
      req.flash('success', 'Account was deleted successfully')
      res.redirect('/users');
    } catch (err) {
      req.flash('error', 'User information failed to delete')
      console.log(err)
    }
  });

  router.get('/profile', isLoggedIn, async (req, res, next) => {
    try {


      req.session.save((err) => {
        res.render('profilePages/profile', { user: req.session.user, currentPage: 'POS - Users', success: req.flash('success'), error: req.flash('error') })
      })
    } catch (error) {
      req.flash('error', 'Failed to get user information')
      res.redirect('/users')
      console.log(error)
    }
  });

  router.post('/profile', isLoggedIn, async (req, res, next) => {
    try {
      const user = req.session.user
      const { userid } = user

      const { email, name } = req.body

      await db.query('UPDATE public."usersAccount" SET email = $1, name = $2 WHERE userid = $3 returning *', [email, name, userid])

      const { rows: emails } = await db.query('SELECT * FROM public."usersAccount" WHERE email = $1', [email])
      const data = emails[0]
      req.session.user = data
      req.session.save()

      req.flash('success', 'User information updated')

      res.redirect(`/users/profile`)
    } catch (error) {
      req.flash('error', 'User information failed to update')
      console.log(error)
    }
  });

  router.get('/changepassword', isLoggedIn, async (req, res, next) => {
    try {
      res.render('profilePages/pwchange', {
        success: req.flash('success'), error: req.flash('error'), currentPage: 'POS - Data Users', user: req.session.user
      })
    } catch (e) {
      res.send(e);
    }
  });
  router.post('/changepassword', isLoggedIn, async (req, res) => {
    try {
      let user = req.session.user
      let userid = user.userid
      const { oldPassword, newPassword, retypePassword } = req.body
      const { rows } = await db.query('SELECT * FROM public."usersAccount" WHERE userid = $1', [userid])

      if (newPassword != retypePassword) throw "The password you entered doesn't match"

      if (!bcrypt.compareSync(oldPassword, rows[0].password)) throw `Your Old password is wrong`

      const hash = bcrypt.hashSync(newPassword, saltRounds)
      await db.query('UPDATE public."usersAccount" set password = $1 WHERE userid = $2', [hash, userid])

      req.flash('success', 'Your password has been updated')
      res.redirect('/users/changepassword')
    } catch (err) {
      req.flash('error', err)
      console.log('inierror', err)
      return res.redirect('/users/changepassword')
    }
  })

  return router;
}
