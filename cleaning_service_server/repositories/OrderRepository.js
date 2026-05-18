const Order = require('../models/Order');
const Service = require('../models/Service');
const User = require('../models/User');

class OrderRepository {
    static async create(orderData) {
        return await Order.create(orderData);
    }

    static async findAllByUserId(userId) {
        return await Order.findAll({
            where: { user_id: userId },
            include: [
                { model: Service, as: 'service' },
                { model: User, as: 'cleaner', attributes: ['id', 'username', 'email'] }
            ]
        });
    }

    static async findAllByCleanerId(cleanerId) {
        return await Order.findAll({
            where: { cleaner_id: cleanerId },
            include: [
                { model: Service, as: 'service' },
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
            ]
        });
    }

    static async findAll() {
        return await Order.findAll({
            include: [
                { model: Service, as: 'service' },
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'cleaner', attributes: ['id', 'username', 'email'] }
            ]
        });
    }

    static async findById(orderId) {
        return await Order.findByPk(orderId, {
            include: [
                { model: Service, as: 'service' },
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'cleaner', attributes: ['id', 'username', 'email'] }
            ]
        });
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

    static async findAllByServiceId(serviceId) {
        return await Order.findAll({ where: { service_id: serviceId } });
    }

    static async deleteAllByServiceId(serviceId) {
        return await Order.destroy({ where: { service_id: serviceId }});
    }
}

module.exports = OrderRepository;
