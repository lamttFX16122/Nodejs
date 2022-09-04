const path = require('path');
const fs = require('fs');
const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductFromFile = cb => {
    fs.readFile(p, (err, value) => {
        if (value == '') {
            cb([]);
        } else {
            cb(JSON.parse(value));
        }
    });
}
module.exports = class Product {
    constructor(t) {
        this.title = t;
    }
    save() {
        getProductFromFile(prod => {
            prod.push(this);
            fs.writeFile(p, JSON.stringify(prod), (err) => {
                console.log(err);
            });
        })
    }

    static fetchProduct(cb) {
        getProductFromFile(cb);
    }
}