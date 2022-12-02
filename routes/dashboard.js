const express = require('express');
const router = express.Router();

const currencyFormatter = require('currency-formatter');
const { isLoggedIn } = require('../helpers/util');

module.exports = (db) => {
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const { startdate, enddate } = req.query

            if (startdate, enddate) {
                const { rows: purchases } = await db.query('SELECT time AS timepurch, sum(totalsum) AS total FROM purchases WHERE time BETWEEN $1 AND $2 GROUP BY timepurch', [startdate, enddate])

                const { rows: sales } = await db.query('SELECT time AS timesales, sum(totalsum) AS total FROM sales WHERE time BETWEEN $1 AND $2 GROUP BY timesales', [startdate, enddate])

                const { rows: salestotal } = await db.query('SELECT time AS times, COUNT(*) AS total FROM sales GROUP BY times')

                res.render('dashboard/home', { user: req.session.user, currentPage: 'POS - Dashboard', purchases, sales, salestotal, currencyFormatter, query: req.query });
            } else {
                const { rows: purchases } = await db.query('SELECT sum(totalsum) AS total FROM purchases')

                const { rows: sales } = await db.query('SELECT sum(totalsum) AS total FROM sales')

                const { rows: salestotal } = await db.query('SELECT COUNT(*) AS total FROM sales')

                res.render('dashboard/home', { user: req.session.user, currentPage: 'POS - Dashboard', purchases, sales, salestotal, currencyFormatter, query: req.query });
            }
        } catch (error) {
            console.log(error)
        }
    });


    router.get('/revsource', isLoggedIn, async (req, res, next) => {
        try {
            const { startdate, enddate } = req.query

            console.log(startdate, 'START', enddate, 'END')
            if (startdate, enddate) {
                const { rows: direct } = await db.query("SELECT COUNT(*) FROM sales WHERE customer = 1 AND time BETWEEN $1 AND $2", [startdate, enddate])

                const { rows: member } = await db.query("SELECT COUNT(*) FROM sales WHERE customer != 1 AND time BETWEEN $1 AND $2", [startdate, enddate])

                res.json({ member, direct })
            } else {
                const { rows: direct } = await db.query("SELECT COUNT(*) FROM sales WHERE customer = 1")

                const { rows: member } = await db.query("SELECT COUNT(*) FROM sales WHERE customer != 1")

                console.log(direct, member)
                res.json({ member, direct })
            }
        } catch (error) {
            console.log(error)
        }
    });

    router.get('/earnoverview', isLoggedIn, async (req, res, next) => {
        try {
            const { startdate, enddate } = req.query

            if (startdate, enddate) {
                const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases WHERE time BETWEEN $1 AND $2 GROUP BY monthly, forsort ORDER BY forsort", [startdate, enddate])

                const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales WHERE time BETWEEN $1 AND $2 GROUP BY monthly, forsort ORDER BY forsort", [startdate, enddate])

                let getMonth = []

                for (let i = 0; i < totalpurchase.length; i++) {
                    getMonth.push(totalpurchase[i].monthly)
                }

                let data = totalpurchase.concat(totalsales)
                let newData = {}
                let income = []

                data.forEach(item => {
                    if (newData[item.forsort]) {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
                    } else {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
                    }
                });

                for (const key in newData) {
                    income.push(Number(newData[key].revenue - newData[key].expense))
                }

                res.json({ getMonth, income })
            } else {
                const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases GROUP BY monthly, forsort ORDER BY forsort")

                const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales GROUP BY monthly, forsort ORDER BY forsort")

                let getMonth = []

                for (let i = 0; i < totalpurchase.length; i++) {
                    getMonth.push(totalpurchase[i].monthly)
                }

                let data = totalpurchase.concat(totalsales)
                let newData = {}
                let income = []

                data.forEach(item => {
                    if (newData[item.forsort]) {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
                    } else {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
                    }
                });

                for (const key in newData) {
                    income.push(Number(newData[key].revenue - newData[key].expense))
                }

                res.json({ getMonth, income })
            }

        } catch (error) {
            console.log(error)
        }
    });

    // router.get('/datatable', async (req, res) => {
    //     let params = []

    //     if (req.query.search.value) {
    //         params.push(`time ilike '%${req.query.search.value}%'`)
    //     }

    //     const limit = req.query.length
    //     const offset = req.query.start
    //     const sortBy = req.query.columns[req.query.order[0].column].data
    //     const sortMode = req.query.order[0].dir

    //     const total = await db.query(`SELECT COUNT(*) AS total FROM purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
    //     const data = await db.query(`SELECT * FROM purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    //     console.log(data.rows)
    //     const response = {
    //         "draw": Number(req.query.draw),
    //         "recordsTotal": total.rows[0].total,
    //         "recordsFiltered": total.rows[0].total,
    //         "data": data.rows
    //     }
    //     res.json(response)
    // });

    return router;
}