const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Payment extends Model {}

Payment.init({
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'paid'
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'card'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'payments',
    modelName: 'payment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
    Payment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = Payment;
