var express = require('express');
var router = express.Router();

module.exports = (db) => {
  router.get('/users', function (req, res, next) {
    res.send('respond with a resource');
  });

  return router;
}
