const express = require('express');
const path = require('path');
const route = express.Router();
route.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
})
route.post('/product', (req, res) => {
    console.log(req.body)
    res.redirect("/");
})

module.exports = route;