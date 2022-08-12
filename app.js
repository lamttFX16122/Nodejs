const http = require('http');
const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    res.setHeader('Content-Type', 'text/html');
    //html
    var str = '<html>';
    str += '<header>';
    str += '<title>My First Page</title>';
    str += '</header>';
    str += '<body>';
    str += '<h1>Hello from my Nodejs Server</h1>';
    str += '</body>';
    str += '</html>';
    res.write(str);
    res.end();
})

server.listen(8099);