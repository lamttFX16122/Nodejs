const Product = require('../models/product');
const Cart = require('../models/cart');
const cartItem = require('../models/cart-item');
exports.getProducts = (req, res, next) => {
    Product.findAll().then((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    // Product.findById(id)
    //     .then(([rows, fileContent]) => {
    //         res.render('shop/product-detail', {
    //             product: rows[0],
    //             pageTitle: rows[0].title,
    //             path: '/product'
    //         })
    //     })
    //     .catch(err => console.log(err));
    Product.findByPk(id)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/product'
            })
        }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err))
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(product => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: product
                    });
                })
        }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchCart = cart;
            return cart.getProducts({ where: { id: id } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
            }
            return Product.findByPk(id)
        })
        .then(prod => {
            return fetchCart.addProduct(prod, { through: { quantity: newQuantity } })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};
exports.cartDeleteItem = (req, res, next) => {
    const id = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: id } })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}