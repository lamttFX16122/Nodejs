const path = require('path');

// const mongoConnect = require('./util/database').mongoConnect;
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findUserById('6333ed284e1cf414acdca6db')
//         .then(user => {
//             req.user = new User(user.username, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => console.log(err));
// })

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

app.use(errorController.get404);
const url = 'mongodb+srv://thanhlam:thanhlam@cluster0.hatavqh.mongodb.net/shop?retryWrites=true&w=majority';

mongoose.connect(url)
    .then(result => {
        console.log('Connected');
        app.listen(3000);
    })
    .catch(err => console.log(err))