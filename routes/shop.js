const express = require('express');
const path = require('path');
const rootDirname = require('../util/path');
const route = express.Router();
const adminData = require('./admin');

route.get('/', (req, res, next) => {
    console.log('shop.js', adminData.products);
    res.sendFile(path.join(rootDirname, 'views', 'shop.html'));
});

module.exports = route;