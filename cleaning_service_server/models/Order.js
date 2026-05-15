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
    },
    cleaner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    sequelize,
    tableName: 'orders',
    modelName: 'order',
    timestamps: false
});

Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Order.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    Order.belongsTo(models.User, { foreignKey: 'cleaner_id', as: 'cleaner' });
};

module.exports = Order;
