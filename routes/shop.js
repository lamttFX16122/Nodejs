const express = require('express');
const path = require('path');
const rootDirname = require('../util/path');
const route = express.Router();

route.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDirname, 'views', 'shop.html'));
});

module.exports = route;