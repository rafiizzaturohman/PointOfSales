const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const sql = 'SELECT * FROM public."suppliers"'

            const result = await db.query(sql)

            res.render('suppliersPages/list', { user: req.session.user, data: result.rows, query: req.query, currentPage: 'POS - Suppliers', success: req.flash('success'), error: req.flash('error') });
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    router.get('/datatable', async (req, res) => {
        let params = []

        if (req.query.search.value) {
            params.push(`name ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`address ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`phone ilike '%${req.query.search.value}%'`)
        }

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await db.query(`SELECT COUNT(*) AS total FROM public."suppliers"${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`SELECT * FROM public."suppliers"${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
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
        const data = await db.query('SELECT * FROM public."suppliers"')

        res.render('suppliersPages/add', { user: req.session.user, data: data.rows, currentPage: 'POS - Suppliers' });
    });

    router.post('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { name, address, phone } = req.body

            await db.query('INSERT INTO public."suppliers" (name, address, phone) VALUES ($1, $2, $3)', [name, address, phone])
            req.flash('success', 'Successfully added')

            res.redirect('/suppliers')
        } catch (error) {
            req.flash('error', 'Failed to added')
            console.log(error)
        }
    })

    // EDIT DATA
    router.get('/edit/:supplierid', isLoggedIn, async (req, res, next) => {
        try {
            const { supplierid } = req.params

            const { rows: data } = await db.query('SELECT * FROM public."suppliers" WHERE supplierid = $1', [supplierid])

            res.render('suppliersPages/edit', { user: req.session.user, item: data[0], currentPage: 'POS - Suppliers' });
        } catch (error) {
            console.log(error)
        }
    });

    router.post('/edit/:supplierid', isLoggedIn, async (req, res, next) => {
        try {
            const { supplierid } = req.params
            const { name, address, phone } = req.body

            await db.query('UPDATE public."suppliers" SET name = $1, address = $2, phone = $3 WHERE supplierid = $4', [name, address, phone, supplierid])
            req.flash('success', 'Edited successfully')

            res.redirect('/suppliers')
        } catch (error) {
            req.flash('error', 'Failed to edit')
            console.log(error)
        }
    })

    // DELETE DATA
    router.get('/delete/:supplierid', isLoggedIn, async (req, res, next) => {
        try {
            await db.query('DELETE FROM public."suppliers" WHERE supplierid = $1', [req.params.supplierid])
            req.flash('success', 'Deleted successfully')

            res.redirect('/suppliers');
        } catch (err) {
            req.flash('error', 'Failed to delete')
            console.log(err)
        }
    });
    return router;
}
