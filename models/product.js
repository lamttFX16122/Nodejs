const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');
class Product {
    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = !id ? null : new mongoDb.ObjectId(id); // neu them thi id is null -- neu sua thi id !null
        this.userId = userId;
    }
    save() {
        const db = getDb();
        let dbOb;
        if (this._id) {
            dbOb = db.collection('products').updateOne({ _id: this._id }, { $set: this });
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
    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongoDb.ObjectId(id) })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => console.log(err));
    }

}

module.exports = Product;