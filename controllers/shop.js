const Product = require('../models/product');
const Cart = require('../models/cart');
exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fileContent]) => {
        res.render('shop/product-list', {
            prods: rows,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(err => console.log(err))

};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(([rows, fileContent]) => {
            res.render('shop/product-detail', {
                product: rows[0],
                pageTitle: rows[0].title,
                path: '/product'
            })
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fileContent]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(pro => pro.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty })
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        })
    })

};

exports.postCart = (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id, product => {
        Cart.addProduct(id, product.price);
    })
    res.redirect('/cart');
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
    Product.findById(id, product => {
        Cart.deleteProduct(id, product.price);
        res.redirect('/cart');
    })
}