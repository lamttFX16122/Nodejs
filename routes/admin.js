const express = require('express');
const path = require('path');
const rootDirname = require('../util/path');
const route = express.Router();
const products = [];
route.get('/add-product', (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add Product' })
})
route.post('/product', (req, res) => {
    products.push({ title: req.body.title });
    res.redirect("/");
})

exports.route = route;
exports.products = products;