// const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res) => {
        res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    })
    // const server = http.createServer(app);
app.listen(8099);