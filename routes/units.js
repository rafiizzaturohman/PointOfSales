const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const sql = 'SELECT * FROM public."units"'

            const result = await db.query(sql)

            res.render('utilitiesPages/unit/units', { user: req.session.user, data: result.rows, query: req.query });
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    router.get('/datatable', async (req, res) => {
        let params = []

        if (req.query.search.value) {
            params.push(`unit ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`name ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`note ilike '%${req.query.search.value}%'`)
        }

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await db.query(`SELECT COUNT(*) AS total FROM public."units"${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`SELECT * FROM public."units"${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
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
        const data = await db.query('SELECT * FROM public."units"')

        res.render('utilitiesPages/unit/add', { user: req.session.user, data: data.rows });
    });

    router.post('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { unit, name, note } = req.body
            const { rows: units } = await db.query('SELECT * FROM public."units" WHERE unit = $1', [unit])
            if (units.length > 0) {
                req.flash('error', `Unit already exist`)
                return res.redirect('/add')
            }

            await db.query('INSERT INTO public."units" (unit, name, note) VALUES ($1, $2, $3)', [unit, name, note])

            res.redirect('/units')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    })

    // EDIT DATA
    router.get('/edit/:unit', isLoggedIn, async (req, res, next) => {
        const { unit } = req.params

        const { rows: data } = await db.query('SELECT * FROM public."units" WHERE unit = $1', [unit])

        res.render('utilitiesPages/unit/edit', { user: req.session.user, item: data[0] });
    });

    router.post('/edit/:unit', isLoggedIn, async (req, res, next) => {
        try {
            const { unit, name, note } = req.body

            await db.query('UPDATE public."units" SET unit = $1, name = $2, note = $3 WHERE unit = $4', [unit, name, note])

            res.redirect('/units')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    })

    // DELETE DATA
    router.get('/delete/:unit', isLoggedIn, async (req, res, next) => {
        try {
            await db.query('DELETE FROM public."units" WHERE unit = $1', [req.params.unit])

            res.redirect('/units');
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });
    return router;
}
