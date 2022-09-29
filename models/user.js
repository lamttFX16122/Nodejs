const mongoose = require('mongoose');
const product = require('./product');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    let cartProductIndex = this.cart.items.findIndex(value => {
        return value.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    let newUpdatedCart = [...this.cart.items];
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        newUpdatedCart[cartProductIndex].quantity = newQuantity;
    } else {
        newUpdatedCart.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    let updatedCart = {
        items: newUpdatedCart
    };
    this.cart = updatedCart;
    return this.save();
}



module.exports = mongoose.model('User', userSchema);

// const mongoDb = require('mongodb');
// const ObjectId = mongoDb.ObjectId;
// const getDb = require('../util/database').getDb;
// class User {
//     constructor(username, email, cart, id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     };

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(value => {
//             return value.productId.toString() === product._id.toString();
//         });

//         let newQuantity = 1;
//         let newUpdatedCart = [...this.cart.items];
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             newUpdatedCart[cartProductIndex].quantity = newQuantity;
//         } else {
//             newUpdatedCart.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             })
//         }
//         let updatedCart = {
//             items: newUpdatedCart
//         };
//         const db = getDb();
//         return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         })
//         return db.collection('products').find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {

//                 return products.map(j => {
//                     return {...j,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === j._id.toString();
//                         }).quantity
//                     }
//                 })
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
//     getOrder() {
//         const db = getDb();
//         return db.collection('oders').find({ 'user._id': new ObjectId(this._id) }).toArray();
//     }
//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         username: this.username
//                     }
//                 }
//                 return db.collection('oders').insertOne(order);
//             })

//         .then(result => {
//             this.cart = { items: [] };
//             return db.collection('users')
//                 .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } })
//         })
//     }
//     static findUserById(id) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new ObjectId(id) });
//     }

//     deleteProductCart(id) {
//         const db = getDb();
//         const updatedDelete = this.cart.items.filter(i => {
//             return id.toString() !== i.productId.toString();
//         })
//         return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: { items: updatedDelete } } })
//     }
// }
// module.exports = User;