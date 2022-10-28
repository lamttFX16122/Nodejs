const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const Order = require('../models/order');
const PDFDocument = require('pdfkit');


const ITEMS_PER_PAGE = 1;
exports.getProducts = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {

            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/product'

            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {

            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            console.log(err)
                // const error = new Error(err);
                // error.httpStatusCode = 500;
                // return next(error);
        });
};

exports.getCart = async(req, res, next) => {
    await req.user.populate({ path: 'cart.items.productId' })
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products.cart.items

            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
                orders: orders

            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}

//Get invoice
exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.font('Times-Bold').fontSize(26).text("Invoice", {
                underline: true,
                align: 'left'
            });
            pdfDoc.font('Times-Roman').fontSize(15).text(`==============================`, {
                align: 'left'
            });
            let total = 0;
            order.products.forEach((item, index) => {
                total += item.quantity * item.product.price;
                pdfDoc.font('Times-Roman').fontSize(15).text(`${index+1}. ${item.product.title} x ${item.quantity} - $${item.product.price} >>== $${item.quantity * item.product.price}`);
            })
            pdfDoc.font('Times-Roman').fontSize(15).text(`==============================`, {
                align: 'left'
            });
            pdfDoc.font('Times-Bold').fontSize(20).text(`Total: $${total}`);

            pdfDoc.end();

        })
        .catch(err => next(err));

}