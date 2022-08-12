const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        var str_f = '<html>';
        str_f += '<header>';
        str_f += '<title>Enter Message</title>';
        str_f += '</header>';
        str_f += '<body>';
        str_f += '<form action="/message" method="POST">';
        str_f += '<input type="text" name="message">';
        str_f += '<button type="submit">Send</button>';
        str_f += '</form>';
        str_f += '</body>';
        str_f += '</html>';
        res.write(str_f);
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        fs.writeFileSync('message.txt', 'DUMMY');
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }
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