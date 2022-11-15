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


    // ADD DATA
    router.get('/add', isLoggedIn, async (req, res, next) => {
        const data = await db.query('SELECT * FROM public."units"')

        res.render('utilitiesPages/unit/add', { user: req.session.user, data: data.rows });
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

        res.render('utilitiesPages/unit/edit', { user: req.session.user, item: data[0] });
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
