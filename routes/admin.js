const express = require('express');
const route = express.Router();
const productController = require('../controllers/products')

route.get('/add-product', productController.getAddProduct)
route.post('/product', productController.postAddProduct)

exports.route = route;