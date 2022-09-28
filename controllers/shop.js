const Product = require('../models/product');
// const Order = require('../models/order');
// const Cart = require('../models/cart');
// const cartItem = require('../models/cart-item');
// const { redirect } = require('express/lib/response');
exports.getProducts = (req, res, next) => {
    Product.fetchAll().then((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;

    Product.fetchById(id)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/product'
            })
        }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            console.log(products)
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
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    Product.fetchById(id)
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

// exports.getOrders = (req, res, next) => {
//     req.user.getOrders({ include: ['products'] })
//         .then(orders => {
//             res.render('shop/orders', {
//                 path: '/orders',
//                 pageTitle: 'Your Orders',
//                 orders: orders
//             });
//         })
//         .catch(err => console.log(err));
// };

// exports.postOrders = (req, res, next) => {
//     let fetchCart;
//     req.user.getCart()
//         .then(cart => {
//             fetchCart = cart;
//             return cart.getProducts();
//         })
//         .then(products => {
//             return req.user.createOrder()
//                 .then(order => {
//                     order.addProducts(products.map(product => {
//                         product.orderItem = { quantity: product.cartItem.quantity };
//                         return product;
//                     }))
//                 })
//                 .catch(err => console.log(err));
//         })
//         .then(result => {
//             return fetchCart.setProducts(null);
//         })
//         .then(result => {
//             res.redirect('/orders')
//         })
//         .catch(err => console.log(err));
// }

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };
exports.cartDeleteItem = (req, res, next) => {
    const id = req.body.productId;
    req.user.deleteProductCart(id)
        .then(result => {
            return res.redirect('/cart');
        })
        .catch(err => console.log(err));
    // .then(cart => {
    //         return cart.getProducts({ where: { id: id } })
    //     })
    //     .then(products => {
    //         const product = products[0];
    //         return product.cartItem.destroy();
    //     })
    //     .then(result => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err))
}