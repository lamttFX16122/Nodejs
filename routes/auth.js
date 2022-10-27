const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const login = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', login.getLogin);
router.post('/login',
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password', 'Password has to be valid')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
    login.postLogin);
router.post('/logout', login.postLogout);

router.get('/signup', login.getSignUp);
router.post('/signup', [
    check('email')
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email exists already, please pick a different one');
                }
            })
    })
    .normalizeEmail(),
    body('password', 'Please enter password with only numbers and text and at least 5 characters')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password have to match!');
        }
        return true;
    }).trim()
], login.postSignUp);

module.exports = router;