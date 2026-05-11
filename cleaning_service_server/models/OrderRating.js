const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class OrderRating extends Model {}

OrderRating.init({
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true 
    },
    rating_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
}, {
    sequelize,
    tableName: 'orderratings',
    modelName: 'OrderRating',
    timestamps: false 
});

OrderRating.associate = (models) => {
    OrderRating.belongsTo(models.Order, { foreignKey: 'order_id' });
    OrderRating.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = OrderRating;