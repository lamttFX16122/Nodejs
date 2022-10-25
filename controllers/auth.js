exports.getLogin = (req, res, next) => {
    return res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.isLoggedIn
    })
}
exports.postLogin = (req, res, next) => {
    req.isLoggedIn = true;
    res.redirect('/');
}