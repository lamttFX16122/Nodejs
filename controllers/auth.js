const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator/check')

exports.getLogin = (req, res, next) => {
    let message = req.flash('errLogin');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errMes: message,
        oldDoc: {
            email: '',
            password: ''
        },
        validationError: []
    })
}
exports.postLogin = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errMes: error.array()[0].msg,
            oldDoc: {
                email: req.body.email,
                password: req.body.password
            },
            validationError: error.array()
        })
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {

                req.flash('errLogin', 'Email is not exist');
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errMes: 'Invalid Email or Password',
                    oldDoc: {
                        email: req.body.email,
                        password: req.body.password
                    },
                    validationError: []
                })
            }
            bcryptjs.compare(req.body.password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        })
                    }
                    req.flash('errLogin', 'Invalid password');
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        path: '/login',
                        errMes: 'Invalid Email or Password',
                        oldDoc: {
                            email: req.body.email,
                            password: req.body.password
                        },
                        validationError: []
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login');
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getSignUp = (req, res, next) => {
    let message = req.flash('errLogin');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: '/signup',
        errMes: message,
        oldDoc: {
            email: '',
            username: '',
            password: '',
            confirm: ''
        },
        validationError: []
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const pw = req.body.password;
    const username = req.body.username;
    const confirm = req.body.confirm;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign Up',
            path: '/signup',
            errMes: error.array()[0].msg,
            oldDoc: {
                email: email,
                username: username,
                password: pw,
                confirm: confirm
            },
            validationError: error.array()
        })
    }
    bcryptjs.hash(pw, 12)
        .then(hashPw => {
            const newUser = new User({
                email: email,
                username: username,
                password: hashPw,
                cart: { items: [] }
            })
            return newUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })

}