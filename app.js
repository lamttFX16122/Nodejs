const http = require('http');
const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log("In the Middleware");
    next();
})
app.use((req, res, next) => {
    console.log("In the second Middleware!");
})
const server = http.createServer(app);
server.listen(8099);