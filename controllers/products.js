const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: 'add-product',
        productCSS: true,
        addProductActive: true
    })
}

exports.postAddProduct = (req, res) => {
    products.push({ title: req.body.title });
    res.redirect("/");
}

exports.getProduct = (req, res, next) => {
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        productLength: products.length > 0,
        productCSS: true,
        shopActive: true
    })
}