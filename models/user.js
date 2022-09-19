const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define({
    id: {
        type: Sequelize.NUMBER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});
module.exports = User;