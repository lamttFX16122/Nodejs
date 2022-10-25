exports.getLogin = (req, res, next) => {
    //  const isLoggedIn = req.get('Cookie').split(':')[1].trim();
    return res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    })
}
exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn:true; HttpOnly');
    res.redirect('/');
}