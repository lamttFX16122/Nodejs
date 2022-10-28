const { validationResult } = require('express-validator/check')
const fileHelper = require('../util/file');
const Product = require('../models/product');
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
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image) {
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errMes: 'Attached file is not an image',
            product: {
                title: title,
                price: price,
                description: description
            },
            validationError: []
        });
    }
    let errors = validationResult(req);
    let imageUrl = image.path;
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
    const updatedImgUrl = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    // if (!updatedImgUrl) {
    //     return res.render('admin/edit-product', {
    //         pageTitle: 'Edit Product',
    //         path: '/admin/edit-product',
    //         editing: false,
    //         errMes: 'Attached file is not an image',
    //         product: {
    //             title: title,
    //             price: price,
    //             description: description
    //         },
    //         validationError: []
    //     });
    // }

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
                description: updatedDescription
            },
            validationError: errors.array()
        });
    }
    // const product = new Product(updatedTitle, updatedPrice, updatedImgUrl, updatedDescription, new ObjectId(id))
    Product.findById(id).then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            if (updatedImgUrl) {
                fileHelper.deleteFile(updatedImgUrl);
                product.imageUrl = updatedImgUrl.path;
            }

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
    Product.findById(id)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: id, userId: req.user._id })
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}