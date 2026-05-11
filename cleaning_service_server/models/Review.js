const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Review extends Model {}

Review.init({
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
    review_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
}, {
    sequelize,
    tableName: 'reviews',
    modelName: 'Review',
    timestamps: false 
});

Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'user_id' });
    Review.belongsTo(models.Service, { foreignKey: 'service_id' });
};

module.exports = Review;