const ObjectId = require('mongodb').ObjectId();
const getDb = require('../util/database').getDb;
class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    };

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }
    static findUserById(id) {
        const db = getDb();
        return db.ObjectId('users').findOne({ _id: new ObjectId(id) });
    }
}
module.exports = User;