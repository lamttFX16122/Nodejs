const path = require('path');
const fs = require('fs');


//  path.dirname(require.main.filename);
// let product = [];
module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        let prod = [];
        // console.log("reeeeeeeeeeeeeeee: " + prod)
        // console.log('data controller: ' + JSON.stringify(this))
        fs.readFile(p, (err, value) => {
            if (!err) {
                prod = JSON.parse(value);
            }
            prod.push(this);
            fs.writeFile(p, JSON.stringify(prod), (err) => {
                console.log(err);
            });
        })
    }

    static fetchProduct(cb) {
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, (err, value) => {
            if (err) {
                return cb([]);
            }
            cb(JSON.parse(value));
        });
    }
}