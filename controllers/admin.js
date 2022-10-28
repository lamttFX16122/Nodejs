const { validationResult } = require('express-validator/check')
const Product = require('../models/product');
const mongoose = require('mongoose');
// const ObjectId = mongodb.ObjectId;
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errMes: '',
        product: {
            title: '',
            price: '',
            image: '',
            description: ''
        },
        validationError: []

    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.file;
    console.log(imageUrl)
    const price = req.body.price;
    const description = req.body.description;
    // const imageUrl = image.path;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let mesErr = '';
        errors.array().forEach(er => {
            mesErr += `- ${er.msg} \n`;
        })
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errMes: mesErr,
            product: {
                title: title,
                price: price,
                imageUrl: imageUrl,
                description: description
            },
            validationError: errors.array()
        });
    }
    const product = new Product({
        // _id: new mongoose.Types.ObjectId('63354c4b4788bc5122efb345'),
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user
    });
    product.save().then((result) => {
            if (this.id)
                console.log("Created Product");
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit == 'true' ? true : false;
    const id = req.params.productId; //123

    if (!editMode) {
        return res.redirect('/');
    }

    Product.findById(id)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                errMes: '',
                product: product,
                validationError: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImgUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let mesErr = '';
        errors.array().forEach(er => {
            mesErr += `- ${er.msg} \n`;
        })
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errMes: mesErr,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                imageUrl: updatedImgUrl,
                description: updatedDescription
            },
            validationError: errors.array()
        });
    }
    // const product = new Product(updatedTitle, updatedPrice, updatedImgUrl, updatedDescription, new ObjectId(id))
    Product.findById(id).then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImgUrl;
            product.description = updatedDescription;
            product.save()
        }).then((value) => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'

            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.deleteProductbyId = (req, res, next) => {
    const id = req.body.productId;
    Product.findByIdAndRemove(id)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}