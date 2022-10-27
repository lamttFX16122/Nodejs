const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../Middleware/is-auth');


// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, [
    body('title', 'Title must be more than 3 characters').isLength({ min: 3 }).trim(),
    body('imageUrl', 'Url unvalid').isURL(),
    body('price', 'price unvalid').isFloat(),
    body('description', 'description must be greater than 3 and les than 100 characters').isLength({ min: 3, max: 200 }).trim()
], adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title', 'Title must be more than 3 characters').isLength({ min: 3 }).trim(),
    body('imageUrl', 'Url unvalid').isURL(),
    body('price', 'price unvalid').isFloat(),
    body('description', 'description must be greater than 3 and les than 100 characters').isLength({ min: 3, max: 200 }).trim()
], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.deleteProductbyId);

module.exports = router;