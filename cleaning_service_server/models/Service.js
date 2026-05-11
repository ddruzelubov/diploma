const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Service extends Model {}

Service.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'service',
    tableName: 'services',
    timestamps: false
});

module.exports = Service;