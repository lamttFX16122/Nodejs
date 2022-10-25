const express = require('express');
const router = express.Router();
const login = require('../controllers/auth');

router.get('/login', login.getLogin);
router.post('/login', login.postLogin);
router.post('/logout', login.postLogout);

router.get('/signup', login.getSignUp);
router.post('/signup', login.postSignUp);

module.exports = router;