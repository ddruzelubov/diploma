const User = require('./User');
const Service = require('./Service');
const Order = require('./Order');
const Review = require('./Review');
const OrderRating = require('./OrderRating');
const Payment = require('./Payment');

const models = {
    User,
    Service,
    Order,
    Review,
    OrderRating,
    Payment
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = models;