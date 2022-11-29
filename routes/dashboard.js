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

            console.log(sales)
            res.render('dashboard/home', { user: req.session.user, currentPage: 'POS - Dashboard', purchases, sales, salestotal, currencyFormatter });
        } catch (error) {
            console.log(error)
        }

        router.get('/revsource', isLoggedIn, async (req, res, next) => {
            try {
                const { rows: direct } = await db.query('SELECT COUNT(*) FROM sales WHERE customer = 1')
                const { rows: member } = await db.query('SELECT COUNT(*) FROM sales WHERE customer != 1')

                res.json({ member, direct })
            } catch (error) {
                console.log(error)
            }
        });

        router.get('/earnoverview', isLoggedIn, async (req, res, next) => {
            try {
                const { rows: month } = await db.query('SELECT time FROM purchases')
                const { rows: totalpurch } = await db.query('SELECT totalsum AS totalpurch FROM purchases')
                const { rows: totalsales } = await db.query('SELECT totalsum AS totalsales FROM sales')

                res.json({ month, totalpurch, totalsales })
            } catch (error) {
                console.log(error)
            }
        });

        router.get('/datatable', async (req, res) => {
            let params = []

            if (req.query.search.value) {
                params.push(`time ilike '%${req.query.search.value}%'`)
            }

            const limit = req.query.length
            const offset = req.query.start
            const sortBy = req.query.columns[req.query.order[0].column].data
            const sortMode = req.query.order[0].dir

            const total = await db.query(`SELECT COUNT(*) AS total FROM purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
            const data = await db.query(`SELECT * FROM purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
            const response = {
                "draw": Number(req.query.draw),
                "recordsTotal": total.rows[0].total,
                "recordsFiltered": total.rows[0].total,
                "data": data.rows
            }
            res.json(response)
        });
    });

    return router;
}