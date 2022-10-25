const { redirect } = require('express/lib/response');
const User = require('../models/user');
exports.getLogin = (req, res, next) => {
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
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            })
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getSignUp = (req, res, next) => {
    return res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const pw = req.body.password;
    const username = req.body.username;
    const confirm = req.body.confirm;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.redirect('/signup');
            }
            const newUser = new User({
                email: email,
                username: username,
                password: pw,
                cart: { items: [] }
            })
            return newUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err));
}