const sequelize = require('../db.config');
const Customer = require('./customer')(sequelize);

module.exports = {
    sequelize,
    Customer
};
