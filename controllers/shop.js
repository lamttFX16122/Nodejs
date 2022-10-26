const Product = require('../models/product');
const Order = require('../models/order');
const user = require('../models/user');
// const Order = require('../models/order');
// const Cart = require('../models/cart');
// const cartItem = require('../models/cart-item');
// const { redirect } = require('express/lib/response');
exports.getProducts = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            isAuthenticated: req.session.isLoggedIn
        });
    }).catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/product',
                isAuthenticated: req.session.isLoggedIn
            })
        }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err))
};

exports.getCart = async(req, res, next) => {
    await req.user.populate({ path: 'cart.items.productId' })
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products.cart.items,
                isAuthenticated: req.session.isLoggedIn
            });
        }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            return res.redirect('/cart');
        })
        .catch(err => console.log(err));
    // let fetchCart;
    // let newQuantity = 1;
    // req.user.getCart()
    //     .then(cart => {
    //         fetchCart = cart;
    //         return cart.getProducts({ where: { id: id } })
    //     })
    //     .then(products => {
    //         let producte;
    //         if (products.length > 0) {
    //             product = products[0];
    //         }

    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //         }
    //         return Product.findByPk(id)
    //     })
    //     .then(prod => {
    //         return fetchCart.addProduct(prod, { through: { quantity: newQuantity } })
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            console.log(orders)
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.postOrders = (req, res, next) => {
    req.user.populate({ path: 'cart.items.productId' })
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: {...i.productId._doc }
                }
            });
            const order = new Order({
                products: products,
                user: {
                    username: req.user.username,
                    userId: req.user
                }
            })
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders') //('/orders')
        })
        .catch(err => console.log(err));
}

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };
exports.cartDeleteItem = (req, res, next) => {
    const id = req.body.productId;
    req.user.removeCartItem(id)
        .then(result => {
            return res.redirect('/cart');
        })
        .catch(err => console.log(err));

}