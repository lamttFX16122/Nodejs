const path = require('path');

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');

const User = require('./models/user');
const uri = 'mongodb+srv://thanhlam:thanhlam@cluster0.hatavqh.mongodb.net/shop?retryWrites=true&w=majority';

const csrfProtection = csrf();
const app = express();
const store = new MongoDBSession({
    uri: uri,
    collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const loginRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false, // đặt lại session (renew) cho mỗi iu cầu
    seveUninitialized: false, //đánh dấu conenect SID 
    store: store
}))

app.use(csrfProtection);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use((req, res, next) => {

    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.use(errorController.get404);

mongoose.connect(uri)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err))