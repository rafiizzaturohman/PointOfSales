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
                req.flash('error', 'Product already exist!')
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
            const { barcode } = req.params
            const { name, stock, purchaseprice, sellingprice, unit, picture } = req.body

            await db.query('UPDATE public."goods" SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7', [barcode, name, stock, purchaseprice, sellingprice, unit, picture])

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
