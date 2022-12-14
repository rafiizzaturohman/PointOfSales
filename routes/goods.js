const express = require('express');
const router = express.Router();
const path = require('path')

const { isAdmin } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/', isAdmin, async (req, res, next) => {
        try {
            let sql = 'SELECT goods.barcode, goods.name, goods.stock, goods.purchaseprice, goods.sellingprice, units.unit, goods.picture FROM public."goods" JOIN public."units" ON goods.unit = units.unit'

            const result = await db.query(sql)

            res.render('utilitiesPages/good/list', { user: req.session.user, data: result.rows, query: req.query, currentPage: 'POS - Goods', success: req.flash('success'), error: req.flash('error') });
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
            params.push(`unit ilike '%${req.query.search.value}%'`)
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
    router.get('/add', isAdmin, async (req, res, next) => {
        try {
            const data = await db.query('SELECT goods.*, units.* FROM goods LEFT JOIN units ON goods.unit = units.unit')
            const { rows: unit } = await db.query('SELECT * FROM units')

            res.render('utilitiesPages/good/add', { user: req.session.user, data: data.rows, units: unit, currentPage: 'POS - Goods' });
        } catch (error) {
            console.log(error)
        }
    });

    router.post('/add', isAdmin, async (req, res, next) => {
        try {
            let picture;
            let uploadPath;

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            // The name of the input field (i.e. "picture") is used to retrieve the uploaded file
            picture = req.files.picture;
            const imagefiles = `${Date.now()}-${picture.name}`
            uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', imagefiles);

            // Use the mv() method to place the file somewhere on your server
            picture.mv(uploadPath)

            const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body
            const { rows: goods } = await db.query('SELECT * FROM public."goods" WHERE barcode = $1', [barcode])
            if (goods.length > 0) {
                req.flash('error', 'Product already exist!')
                return res.redirect('/goods/add')
            }

            await db.query('INSERT INTO public."goods" (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)', [barcode, name, stock, purchaseprice, sellingprice, unit, imagefiles])
            req.flash('success', 'Goods was added')

            res.redirect('/goods')
        } catch (error) {
            req.flash('error', 'Failed to add')
            res.send(error)
        }
    })

    // EDIT DATA
    router.get('/edit/:barcode', isAdmin, async (req, res, next) => {
        try {
            const { barcode } = req.params

            const { rows: data } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])
            const { rows: unit } = await db.query('SELECT * FROM units')

            res.render('utilitiesPages/good/edit', { user: req.session.user, item: data[0], units: unit, currentPage: 'POS - Goods' });
        } catch (error) {
            console.log(error)
        }
    });

    router.post('/edit/:barcode', isAdmin, async (req, res, next) => {
        try {
            const { barcode } = req.params
            const { name, stock, purchaseprice, sellingprice, unit } = req.body

            let picture;
            let uploadPath;

            if (!req.files || Object.keys(req.files).length === 0) {
                await db.query('UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5 WHERE barcode = $6', [name, stock, purchaseprice, sellingprice, unit, barcode])
            } else {
                // The name of the input field (i.e. "picture") is used to retrieve the uploaded file
                picture = req.files.picture;
                const imagesfiles = `${Date.now()}-${picture.name}`
                uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', imagesfiles);

                // Use the mv() method to place the file somewhere on your server
                picture.mv(uploadPath)

                await db.query('UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7', [name, stock, purchaseprice, sellingprice, unit, imagesfiles, barcode])

            }
            req.flash('success', 'Updated successfully')
            res.redirect('/goods')
        } catch (err) {
            req.flash('error', 'Failed to edit')
            console.log(err)
        }
    })

    // DELETE DATA
    router.get('/delete/:barcode', isAdmin, async (req, res, next) => {
        try {
            await db.query('DELETE FROM public."goods" WHERE barcode = $1', [req.params.barcode])
            req.flash('success', 'Deleted successfully')

            res.redirect('/goods');
        } catch (err) {
            req.flash('error', 'Failed to delete')
            console.log(err)
        }
    });
    return router;
}
