const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');
class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id
    }

    save() {
        const db = getDb();
        let dbOb;
        if (this._id) {
            console.log('THIS: ', this)
            dbOb = db.collection('products').updateOne({ _id: new mongoDb.ObjectId(this._id) }, { $set: this });
        } else {
            dbOb = db.collection('products').insertOne(this);
        }
        return dbOb.then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.log(err));
    }
    static fetchById(id) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongoDb.ObjectId(id) })
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err));
    }

}

module.exports = Product;