var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
  router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      const data = await db.query('SELECT * FROM public."usersAccount"')
      res.render('page/users', { user: req.session.user, data: data.rows });

    } catch (err) {
      console.log(err)
      res.send(err)
    }
  });

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
