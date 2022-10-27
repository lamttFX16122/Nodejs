const express = require('express');
const { check } = require('express-validator/check');
const router = express.Router();
const login = require('../controllers/auth');

router.get('/login', login.getLogin);
router.post('/login', login.postLogin);
router.post('/logout', login.postLogout);

router.get('/signup', login.getSignUp);
router.post('/signup', check('email').isEmail(), login.postSignUp);

module.exports = router;