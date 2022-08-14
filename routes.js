const fs = require('fs');

const requestHandler = (req, res) => {
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
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFileSync('message.txt', message.replaceAll('+', ' '));
        })

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
}

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded text';

// module.exports={
//     handler: requestHandler,
//     someText: 'Some hard coded text'
// }

exports.handler = requestHandler;
exports.someText = 'Some hard coded text';