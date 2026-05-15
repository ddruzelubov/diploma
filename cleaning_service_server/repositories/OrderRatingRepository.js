const OrderRating = require('../models/OrderRating');
const Order = require('../models/Order'); 
const User = require('../models/User');
const Service = require('../models/Service'); 

class OrderRatingRepository {
    static async create(orderRatingData) {
        return await OrderRating.create(orderRatingData);
    }

    static async findAllByOrderId(orderId) {
        return await OrderRating.findAll({
            where: { order_id: orderId },
            include: [{ model: User }]
        });
    }

    static async findAll() {
        return await OrderRating.findAll({
            include: [
                { model: User },
                { 
                    model: Order,
                    include: [{ model: Service, as: 'service' }] 
                }
            ]
        });
    }

    static async findAllByUserId(userId) {
        return await OrderRating.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Order,
                    include: [{ model: Service, as: 'service' }]
                }, 
                { model: User }
            ]
        });
    }

    static async findById(orderRatingId) {
        return await OrderRating.findByPk(orderRatingId, { 
            include: [
                { model: User },
                { 
                    model: Order,
                    include: [{ model: Service, as: 'service' }] 
                }
            ] 
        });
    }

    static async update(orderRating) {
        return await orderRating.save();
    }

    static async delete(orderRating) {
        return await orderRating.destroy();
    }

    static async deleteAllByUserId(userId) {
        return await OrderRating.destroy({ where: { user_id: userId }});
    }

    static async deleteAllByOrderId(orderId) {
        return await OrderRating.destroy({ where: { order_id: orderId }});
    }

    static async deleteAllByServiceId(serviceId) {
        const orders = await Order.findAll({
            where: { service_id: serviceId }
        });
    
        if (orders.length > 0) {
            const orderIds = orders.map(order => order.id); 
            return await OrderRating.destroy({
                where: { order_id: orderIds }
            });
        }

        return 0;
    }
}

module.exports = OrderRatingRepository;
