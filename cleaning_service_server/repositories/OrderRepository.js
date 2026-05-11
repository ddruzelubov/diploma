const Order = require('../models/Order');
const Service = require('../models/Service');

class OrderRepository {
    static async create(orderData) {
        return await Order.create(orderData);
    }

    static async findAllByUserId(userId) {
        return await Order.findAll({
            where: { user_id: userId },
            include: [{ model: Service }]
        });
    }

    static async findAll() {
        return await Order.findAll({
            include: [{ model: Service }]
        });
    }

    static async findById(orderId) {
        return await Order.findByPk(orderId, { include: [{ model: Service }] });
    }

    static async update(order) {
        return await order.save();
    }

    static async delete(orderId) {
        return await Order.destroy({where: {id: orderId}});
    }

    static async deleteAllByUserId(userId) {
        return await Order.destroy({ where: { user_id: userId }});
    }

    static async deleteAllByServiceId(serviceId) {
        return await Order.destroy({ where: { service_id: serviceId }});
    }
}

module.exports = OrderRepository;