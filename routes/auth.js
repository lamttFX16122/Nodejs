const express = require('express');
const { check } = require('express-validator/check');
const router = express.Router();
const login = require('../controllers/auth');

router.get('/login', login.getLogin);
router.post('/login', login.postLogin);
router.post('/logout', login.postLogout);

router.get('/signup', login.getSignUp);
router.post('/signup', check('email')
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
        if (value === 'a@a.com') {
            throw new Error('This email address if forbidden');
        }
        return true;
    }), login.postSignUp);

module.exports = router;