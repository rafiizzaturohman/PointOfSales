const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const currencyFormatter = require('currency-formatter')

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const sql = 'SELECT * FROM public."purchases"'

            const result = await db.query(sql)

            res.render('purchasesPages/list', { user: req.session.user, data: result.rows, query: req.query, currentPage: 'POS - Purchases' });
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
        const data = await db.query(`SELECT * FROM public."purchases"${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows
        }
        res.json(response)
    });

    // ADD DATA
    router.get('/add', isLoggedIn, async (req, res, next) => {
        const { rows } = await db.query('SELECT * FROM public."purchases"')
        const noInvoice = req.query.noInvoice
        const data = await db.query('SELECT * FROM public."purchaseitems" WHERE invoice = $1')

        res.render('purchasesPages/add', { user: req.session.user, data: data.rows, item: data[0], currentPage: 'POS - Purchases', rows });
    });

    router.post('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { invoice, time, totalsum, supplier, operator } = req.body

            await db.query('INSERT INTO public."purchases" (invoice, time, totalsum, supplier, operator) VALUES ($1, $2, $3, $4, $5)', [invoice, time, totalsum, supplier, operator])

            res.redirect('/purchase')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    })

    // EDIT DATA
    router.get('/edit/:invoice', isLoggedIn, async (req, res, next) => {
        const { invoice } = req.params

        const { rows: data } = await db.query('SELECT * FROM public."purchases" WHERE invoice = $1', [invoice])

        res.render('purchasesPages/edit', { user: req.session.user, item: data[0], currentPage: 'POS - Purchases' });
    });

    router.post('/edit/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            const inpoice = req.params.invoice
            const { invoice, time, totalsum, supplier, operator } = req.body

            await db.query('UPDATE public."purchases" SET invoice = $1, time = $2, totalsum = $3, supplier = $4, operator = $5 WHERE invoice = $6', [invoice, time, totalsum, supplier, operator, inpoice])

            res.redirect('/purchase')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    })

    // DELETE DATA
    router.get('/delete/:invoice', isLoggedIn, async (req, res, next) => {
        try {
            await db.query('DELETE FROM public."purchases" WHERE invoice = $1', [req.params.invoice])

            res.redirect('/purchase');
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });
    return router;
}