const express = require('express');
const router = express.Router();
const currencyFormatter = require('currency-formatter')
const moment = require('moment')

const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            res.render('purchasesPages/list', { user: req.session.user, query: req.query, currentPage: 'POS - Purchases' });
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    router.get('/datatable', async (req, res) => {
        let params = []

        if (req.query.search.value) {
            params.push(`invoice ilike '%${req.query.search.value}%'`)
        }

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await db.query(`SELECT COUNT(*) AS total FROM public."purchases"${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`SELECT purchases.*, suppliers.* FROM public."purchases" LEFT JOIN suppliers ON purchases.supplier = suppliers.supplierid${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows
        }
        res.json(response)
    });

    router.get('/create', isLoggedIn, async (req, res, next) => {
        try {
            const { userid } = req.session.user
            const { supplier } = req.body

            const { rows: data } = await db.query('INSERT INTO purchases(totalsum, operator, supplier) VALUES(0, $1, $2) returning *', [userid, supplier])
            res.redirect(`/purchases/show/${data[0].invoice}`)
        } catch (err) {
            console.log(err)
        }
    });

    router.get('/show/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: purchases } = await db.query('SELECT purchases.*, suppliers.* FROM purchases LEFT JOIN suppliers ON purchases.supplier = suppliers.supplierid WHERE invoice = $1', [req.params.invoice])
            const { rows: goods } = await db.query('SELECT barcode, name FROM public."goods" ORDER BY barcode')
            const { rows: supplier } = await db.query('SELECT * FROM public."suppliers" ORDER BY supplierid')

            res.render('purchasesPages/form', { currentPage: 'POS - Purchases', user: req.session.user, purchases: purchases[0], goods, supplier, moment })
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    });

    router.post('/show/:invoice', isLoggedIn, async (req, res) => {
        try {
            const { invoice } = req.params
            const { totalsum, supplier } = req.body
            const { userid } = req.session.user

            await db.query('UPDATE purchases SET totalsum = $1, supplier = $2, operator = $3 WHERE invoice = $4', [totalsum, supplier, userid, invoice])

            res.redirect('/purchases')
        } catch (error) {
            console.log(error)
            return res.redirect('/purchases')
        }
    });

    router.get('/goods/:barcode', isLoggedIn, async (req, res, next) => {
        try {
            const { barcode } = req.params
            const { rows: good } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])

            res.json(good[0])
        } catch (err) {
            res.send(err)
        }
    });

    router.post('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { invoice, itemcode, quantity } = req.body

            await db.query('INSERT INTO purchaseitems(invoice, itemcode, quantity) VALUES ($1, $2, $3)', [invoice, itemcode, quantity])
            const { rows: data } = await db.query('SELECT * FROM purchases WHERE invoice = $1', [invoice])

            res.json(data[0])
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    router.get('/details/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            const { invoice } = req.params
            const { rows: data } = await db.query('SELECT purchaseitems.*, goods.name FROM purchaseitems LEFT JOIN goods ON purchaseitems.itemcode = goods.barcode WHERE purchaseitems.invoice = $1 ORDER BY purchaseitems.id', [invoice])

            res.json(data)
        } catch (err) {
            console.log(err)
        }
    });

    router.get('/delete/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            const { invoice } = req.params

            await db.query('DELETE FROM purchases WHERE invoice = $1', [invoice])

            res.redirect('/purchases')
        } catch (err) {
            console.log(err)
        }
    });

    router.get('/deleteitems/:id', isLoggedIn, async (req, res, next) => {
        try {
            const { id } = req.params
            const { rows: data } = await db.query('DELETE FROM purchaseitems WHERE id = $1 returning *', [id])

            res.redirect(`/purchases/show/${data[0].invoice}`)
        } catch (err) {
            console.log(err)
        }
    });

    return router;
}