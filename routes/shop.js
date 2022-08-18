const express = require('express');
const path = require('path');
const rootDirname = require('../util/path');
const route = express.Router();
const adminData = require('./admin');

route.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', { prods: products, prodsTitle: 'Shop' })
});

module.exports = route;