const express = require('express');
const route = express.Router();
route.get('/add-product', (req, res, next) => {
    var str = '<form action="/admin/product" method="POST">';
    str += '<input type="text" name="title" />';
    str += '<button type="SUBMIT">Add Product</button>';
    str += '</form>';
    res.send(str);
})
route.post('/product', (req, res) => {
    console.log(req.body)
    res.redirect("/");
})

module.exports = route;