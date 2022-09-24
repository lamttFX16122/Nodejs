// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '@717411N'
// });
// module.exports = pool.promise();
//=====================================
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('node-complete', 'root', '@717411N', {
//     dialect: 'mysql',
//     host: 'localhost'
// });

// module.exports = sequelize;
//=====================================
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://thanhlam:thanhlam@cluster0.hatavqh.mongodb.net/?retryWrites=true&w=majority';
const mongoConnect = cb => {
    MongoClient.connect(url)
        .then(connected => {
            console.log('Connected');
            cb(connected);
        })
        .catch(err => console.log(err));
}
module.exports = mongoConnect;