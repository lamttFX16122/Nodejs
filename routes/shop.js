const express = require('express');
const route = express.Router();
const productController = require('../controllers/products');
route.get('/', productController.getProduct);

module.exports = route;