const express = require('express');
const router = express.Router();
const currencyFormatter = require('currency-formatter')
const moment = require('moment')

const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            res.render('salesPages/list', { user: req.session.user, query: req.query, currentPage: 'POS - sales' });
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

        const total = await db.query(`SELECT COUNT(*) AS total FROM public."sales"${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`SELECT sales.*, customers.* FROM public."sales" LEFT JOIN customers ON sales.customer = customers.customerid${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
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
            const { customer } = req.body

            const { rows: data } = await db.query('INSERT INTO sales(totalsum, operator, customer) VALUES(0, $1, $2) returning *', [userid, customer])
            res.redirect(`/sales/show/${data[0].invoice}`)
        } catch (err) {
            console.log(err)
        }
    });

    router.get('/show/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: sales } = await db.query('SELECT sales.*, customers.* FROM sales LEFT JOIN customers ON sales.customer = customers.customerid WHERE invoice = $1', [req.params.invoice])
            const { rows: goods } = await db.query('SELECT barcode, name FROM public."goods" ORDER BY barcode')
            const { rows: customer } = await db.query('SELECT * FROM public."customers" ORDER BY customerid')

            res.render('salesPages/form', { currentPage: 'POS - sales', user: req.session.user, sales: sales[0], goods, customer, moment })
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    });

    router.post('/show/:invoice', isLoggedIn, async (req, res) => {
        try {
            const { invoice } = req.params
            const { totalsum, pay, change, customer } = req.body
            const { userid } = req.session.user

            await db.query('UPDATE sales SET totalsum = $1, pay = $2, change = $3, customer = $4, operator = $5 WHERE invoice = $6', [totalsum, pay, change, customer, userid, invoice])

            res.redirect('/sales')
        } catch (error) {
            console.log(error)
            return res.redirect('/sales')
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
            console.log(req.body)
            await db.query('INSERT INTO saleitems(invoice, itemcode, quantity) VALUES ($1, $2, $3)', [invoice, itemcode, quantity])
            const { rows: data } = await db.query('SELECT * FROM sales WHERE invoice = $1', [invoice])
            console.log(data)

            res.json(data[0])
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    router.get('/details/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            const { invoice } = req.params
            const { rows: data } = await db.query('SELECT saleitems.*, goods.name FROM saleitems LEFT JOIN goods ON saleitems.itemcode = goods.barcode WHERE saleitems.invoice = $1 ORDER BY saleitems.id', [invoice])

            res.json(data)
        } catch (err) {
            console.log(err)
        }
    });

    router.get('/delete/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            const { invoice } = req.params

            await db.query('DELETE FROM sales WHERE invoice = $1', [invoice])

            res.redirect('/sales')
        } catch (err) {
            console.log(err)
        }
    });

    router.get('/deleteitems/:id', isLoggedIn, async (req, res, next) => {
        try {
            const { id } = req.params
            const { rows: data } = await db.query('DELETE FROM sales WHERE id = $1 returning *', [id])

            res.redirect(`/sales/show/${data[0].invoice}`)
        } catch (err) {
            console.log(err)
        }
    });

    return router;
}