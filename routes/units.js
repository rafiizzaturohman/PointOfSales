const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const sortBy = req.query.sortBy == undefined ? `unitid` : req.query.sortBy;
            const sortMode = req.query.sortMode == undefined ? `asc` : req.query.sortMode;

            const url = req.url == '/' ? '/units/?page=1&sortBy=unitid&sortMode=asc' : `/units${req.url}`
            const page = req.query.page || 1
            const limit = req.body.limit || 3
            const offset = (page - 1) * limit

            const position = []
            const values = []

            let count = 1

            let sql = 'SELECT COUNT(*) AS total FROM public."units"'

            const data = await db.query(sql)
            // console.log(data.rows, 'DATA')

            const pages = Math.ceil(data.rows[0].total / limit)
            // console.log(pages, 'PAGES')

            sql = 'SELECT * FROM public."units"'
            sql += ` ORDER BY ${sortBy} ${sortMode} LIMIT $${count++} OFFSET $${count++}`

            const result = await db.query(sql, [limit, offset])

            res.render('utilitiesPages/units', { user: req.session.user, data: result.rows, query: req.query, pages, page, limit, offset, url, sortBy, sortMode });
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });


    // ADD DATA
    router.get('/add', isLoggedIn, async (req, res, next) => {
        const data = await db.query('SELECT * FROM public."units"')

        res.render('utilitiesPages/add', { user: req.session.user, data: data.rows });
    });

    router.post('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { unitid } = req.params
            const { unit, name, note } = req.body
            const { rows: units } = await db.query('SELECT * FROM public."units" WHERE unitid = $1', [unitid])
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
    router.get('/edit/:unitid', isLoggedIn, async (req, res, next) => {
        const { unitid } = req.params

        const { rows: data } = await db.query('SELECT * FROM public."units" WHERE unitid = $1', [unitid])

        res.render('utilitiesPages/edit', { user: req.session.user, item: data[0] });
    });

    router.post('/edit/:unitid', isLoggedIn, async (req, res, next) => {
        try {
            const { unitid } = req.params
            const { unit, name, note } = req.body

            await db.query('UPDATE public."units" SET unit = $1, name = $2, note = $3 WHERE unitid = $4', [unit, name, note, unitid])

            res.redirect('/units')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    })

    // DELETE DATA
    router.get('/delete/:unitid', isLoggedIn, async (req, res, next) => {
        try {
            await db.query('DELETE FROM public."units" WHERE unitid = $1', [req.params.unitid])

            res.redirect('/units');
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });
    return router;
}
