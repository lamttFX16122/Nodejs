const User = require('../models/user');
exports.getLogin = (req, res, next) => {
    //  const isLoggedIn = req.get('Cookie').split(':')[1].trim();
    console.log(req.session)
    return res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    })
}
exports.postLogin = (req, res, next) => {
    User.findById("63354c2d0b8d2c0c3a5e22e2")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}