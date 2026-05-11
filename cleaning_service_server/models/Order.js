const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Order extends Model {}

Order.init({
    area: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    order_date:{
        type: DataTypes.DATE,
        allowNull: false
    },
    completion_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'orders',
    modelName: 'order',
    timestamps: false
});

Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.belongsTo(models.Service, { foreignKey: 'service_id' });
};

module.exports = Order;