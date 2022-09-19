// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: '@717411N'
// });
// module.exports = pool.promise();

const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete', 'root', '@717411N', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;