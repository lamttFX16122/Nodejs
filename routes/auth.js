const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const login = require('../controllers/auth');

router.get('/login', login.getLogin);
router.post('/login', login.postLogin);
router.post('/logout', login.postLogout);

router.get('/signup', login.getSignUp);
router.post('/signup', [
    check('email')
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
        if (value === 'a@a.com') {
            throw new Error('This email address if forbidden');
        }
        return true;
    }),
    body('password', 'Please enter password with only numbers and text and at least 5 characters')
    .isLength({ min: 5 })
    .isAlphanumeric()
], login.postSignUp);

module.exports = router;