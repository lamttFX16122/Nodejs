const express = require('express');
const path = require('path');
const rootDirname = require('../util/path');
const route = express.Router();
const adminData = require('./admin');

route.get('/', (req, res, next) => {
    res.render('shop')
});

module.exports = route;