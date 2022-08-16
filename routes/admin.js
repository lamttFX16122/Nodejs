const express = require('express');
const path = require('path');
const rootDirname = require('../util/path');
const route = express.Router();
route.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDirname, 'views', 'add-product.html'));
})
route.post('/product', (req, res) => {
    console.log(req.body)
    res.redirect("/");
})

module.exports = route;