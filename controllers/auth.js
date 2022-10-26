const bcryptjs = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let mes = req.flash('errLogin');
    if (mes.length > 0) {
        mes = mes[0];
    } else {
        mes = null;
    }
    return res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errMes: mes
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
    return res.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: '/signup'
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
            return bcryptjs.hash(pw, 12)
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
        })

    .catch(err => console.log(err));
}