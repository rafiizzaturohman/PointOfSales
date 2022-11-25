const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../helpers/util');

module.exports = (db) => {
    router.get('/', isLoggedIn, async (req, res, next) => {
        res.render('dashboard/home', { user: req.session.user, currentPage: 'POS - Dashboard' });
    });

    return router;
}