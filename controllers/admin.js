const { redirect } = require('express/lib/response');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
            // formsCSS: true,
            // productCSS: true,
            // activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit == 'true' ? true : false;
    const id = req.params.productId; //123

    if (!editMode) {
        return res.redirect('/');
    }
    Product.findById(id, product => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImgUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const product = new Product(id, updatedTitle, updatedImgUrl, updatedPrice, updatedDescription);
    product.save();
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};

exports.deleteProductbyId = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteProduct(id);
    res.redirect('/admin/products');
}