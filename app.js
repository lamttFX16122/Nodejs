const path = require('path');

// const mongoConnect = require('./util/database').mongoConnect;
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');

const User = require('./models/user');
const uri = 'mongodb+srv://thanhlam:thanhlam@cluster0.hatavqh.mongodb.net/shop?retryWrites=true&w=majority';

const store = new MongoDBSession({
    uri: uri,
    collection: 'sessions'
})
const app = express();

const csrfProtection = csrf();

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

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize.sync()
//     .then((result) => {
//         return User.findByPk(1)

//     }).then(user => {
//         if (!user) {
//             return User.create({ name: 'Max', email: 'test@test.com' })
//         }
//         return user;
//     })
//     .then(user => {
//         return user.createCart();
//     }).then(cart => {
//         app.listen(3000);
//     }).catch(err => console.log(err));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.use(errorController.get404);

mongoose.connect(uri)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err))