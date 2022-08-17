const express = require('express');
const path = require('path');
const rootDirname = require('../util/path');
const route = express.Router();
const products = [];
route.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDirname, 'views', 'add-product.html'));
})
route.post('/product', (req, res) => {
    products.push({ title: req.body.title });
    res.redirect("/");
})

exports.route = route;
exports.products = products;