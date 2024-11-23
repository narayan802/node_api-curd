
const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('node_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize; 

