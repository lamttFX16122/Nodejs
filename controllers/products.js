const productModel = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: 'add-product',
        productCSS: true,
        addProductActive: true
    })
}

exports.postAddProduct = (req, res) => {
    const product = new productModel(req.body.title);
    console.log('Controller: ' + JSON.stringify(product))
    product.save();
    res.redirect("/");
}

exports.getProduct = (req, res, next) => {
    productModel.fetchProduct((product) => {
        res.render('shop', {
            prods: product,
            pageTitle: 'Shop',
            path: '/',
            productLength: product.length > 0,
            productCSS: true,
            shopActive: true
        })
    });

}