const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            let sql = 'SELECT goods.barcode, goods.name, goods.stock, goods.purchaseprice, goods.sellingprice, units.unit, goods.picture FROM public."goods" JOIN public."units" ON goods.unit = units.unit'

            const result = await db.query(sql)

            res.render('utilitiesPages/good/goods', { user: req.session.user, data: result.rows, query: req.query });
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    router.get('/datatable', async (req, res) => {
        let params = []

        if (req.query.search.value) {
            params.push(`barcode ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`name ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`stock = '${req.query.search.value}'`)
        }
        if (req.query.search.value) {
            params.push(`purchaseprice = '${req.query.search.value}'`)
        }
        if (req.query.search.value) {
            params.push(`sellingprice = '${req.query.search.value}'`)
        }
        if (req.query.search.value) {
            params.push(`unit ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`picture ilike '%${req.query.search.value}%'`)
        }

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await db.query(`select count(*) as total from goods${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`select * from goods${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
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
        const data = await db.query('SELECT * FROM public."goods"')

        res.render('utilitiesPages/good/add', { user: req.session.user, data: data.rows });
    });

    router.post('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { barcode, name, stock, purchaseprice, sellingprice, unit, picture } = req.body
            const { rows: goods } = await db.query('SELECT * FROM public."goods" WHERE barcode = $1', [barcode])
            if (goods.length > 0) {
                req.flash(error, 'Product already exist!')
                return res.redirect('/add')
            }

            await db.query('INSERT INTO public."goods" (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)', [barcode, name, stock, purchaseprice, sellingprice, unit, picture])

            res.redirect('/goods')
        } catch (error) {
            req.flash('error', 'Product already exist!')
            res.send(error)
        }
    })

    // EDIT DATA
    router.get('/edit/:barcode', isLoggedIn, async (req, res, next) => {
        const { barcode } = req.params

        const { rows: data } = await db.query('SELECT * FROM public."goods" WHERE barcode = $1', [barcode])

        res.render('utilitiesPages/good/edit', { user: req.session.user, item: data[0] });
    });

    router.post('/edit/:barcode', isLoggedIn, async (req, res, next) => {
        try {
            const barKode = req.params.barcode
            const { barcode, name, stock, purchaseprice, sellingprice, unit, picture } = req.body

            await db.query('UPDATE public."goods" SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7', [name, stock, purchaseprice, sellingprice, unit, picture, barKode])

            res.redirect('/goods')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    })

    // DELETE DATA
    router.get('/delete/:barcode', isLoggedIn, async (req, res, next) => {
        try {
            await db.query('DELETE FROM public."goods" WHERE barcode = $1', [req.params.barcode])

            res.redirect('/goods');
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });
    return router;
}
