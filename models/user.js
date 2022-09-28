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
        const cartProductIndex = this.cart.items.findIndex(value => {
            return value.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        let newUpdatedCart = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            newUpdatedCart[cartProductIndex].quantity = newQuantity;
        } else {
            newUpdatedCart.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            })
        }
        let updatedCart = {
            items: newUpdatedCart
        };
        const db = getDb();
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }
    static findUserById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(id) });
    }
}
module.exports = User;