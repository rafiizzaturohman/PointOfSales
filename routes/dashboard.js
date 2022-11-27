const express = require('express');
const router = express.Router();

const currencyFormatter = require('currency-formatter');
const { isLoggedIn } = require('../helpers/util');

module.exports = (db) => {
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: purchases } = await db.query('SELECT sum(totalsum) AS total FROM purchases')
            const { rows: sales } = await db.query('SELECT sum(totalsum) AS total FROM sales')
            const { rows: salestotal } = await db.query('SELECT COUNT(*) AS total FROM customers')

            res.render('dashboard/home', { user: req.session.user, currentPage: 'POS - Dashboard', purchases, sales, salestotal, currencyFormatter });
        } catch (error) {
            console.log(error)
        }
    });

    return router;
}