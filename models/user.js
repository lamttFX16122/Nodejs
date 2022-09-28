const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectId;
const getDb = require('../util/database').getDb;
class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    };

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const updatedCart = {
            items: [{
                ...product,
                quantity: 1
            }]
        };
        const db = getDb();
        return db.collection('users').updateOne({ _id: new ObjectId(this.id) }, { $set: { cart: updatedCart } });
    }
    static findUserById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(id) });
    }
}
module.exports = User;