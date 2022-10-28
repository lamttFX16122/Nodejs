const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

const isAuth = require('../Middleware/is-auth');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:id', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postOrders);

// router.get('/checkout', shopController.getCheckout);
router.post('/cart-delete-item', isAuth, shopController.cartDeleteItem);

//Get Invoice
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
module.exports = router;