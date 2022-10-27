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
        errMes: message
    })
}
exports.postLogin = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                req.flash('errLogin', 'Invalid email');
                return res.redirect('/login');
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
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login');
                });
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
    let message = req.flash('errLogin');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: '/signup',
        errMes: message
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
            errMes: error.array()[0].msg
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