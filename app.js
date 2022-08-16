const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/add-product', (req, res, next) => {
    var str = '<form action="/product" method="POST">';
    str += '<input type="text" name="title" />';
    str += '<button type="SUBMIT">Add Product</button>';
    str += '</form>';
    res.send(str);
})
app.post('/product', (req, res) => {
    console.log(req.body)
    res.redirect("/");
})
app.use('/', (req, res, next) => {
    res.send('<h1>Hello from Express.js</h1>');
})
const server = http.createServer(app);
server.listen(8099);