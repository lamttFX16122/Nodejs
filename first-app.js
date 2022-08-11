const fs = require('fs');

var content = 'Hello from Nodejs'
fs.writeFileSync('hello.txt', content);