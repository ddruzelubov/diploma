const OrderRatingRepository = require('../repositories/OrderRatingRepository');
const Order = require('../models/Order');
const User = require('../models/User');

class OrderRatingService {
    async createOrderRating(userId, orderId, orderRatingData) {
        const order = await Order.findByPk(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return await OrderRatingRepository.create({
            user_id: userId,
            order_id: orderId,
            rating: orderRatingData.rating,
            comment: orderRatingData.comment,
        });
    }

    async getAllRatingsByUserId(userId) {
        return await OrderRatingRepository.findAllByUserId(userId);
    }

    async getAllOrderRatings() {
        return await OrderRatingRepository.findAll(); 
    }

    async getAllRatingsByOrderId(orderId) {
        return await OrderRatingRepository.findAllByOrderId(orderId);
    }

    async getOrderRatingById(orderRatingId) {
        const rating = await OrderRatingRepository.findById(orderRatingId);
        if (!rating) {
            throw new Error('Rating not found');
        }
        return rating;
    }

    async updateOrderRating(orderRatingId, orderRatingData) {
        const rating = await OrderRatingRepository.findById(orderRatingId);
        if (!rating) {
            throw new Error('Rating not found');
        }

        if (orderRatingData.rating) {
            rating.rating = orderRatingData.rating;
        }
        if (orderRatingData.comment) {
            rating.comment = orderRatingData.comment;
        }

        return await OrderRatingRepository.update(rating);
    }

    async deleteOrderRating(orderRatingId) {
        const rating = await OrderRatingRepository.findById(orderRatingId);
        if (!rating) {
            throw new Error('Rating not found');
        }
        return await OrderRatingRepository.delete(rating);
    }
}

module.exports = new OrderRatingService();