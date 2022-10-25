const express = require('express');
const router = express.Router();
const login = require('../controllers/auth');

router.get('/login', login.getLogin);
router.post('/login', login.postLogin);

module.exports = router;