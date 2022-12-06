module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/')
        }
    },

    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role == 'Admin') {
            next()
        } else {
            res.redirect('/sales')
        }
    }
}