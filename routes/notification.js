const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/notif', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: notif } = await db.query('SELECT barcode, name, stock FROM goods WHERE stock <= 10')

            res.json(notif)
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    router.get('/count', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: countnotif } = await db.query('SELECT COUNT(*) FROM goods WHERE stock <= 10')

            res.json(countnotif)
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    return router
}