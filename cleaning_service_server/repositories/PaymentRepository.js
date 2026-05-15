const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Service = require('../models/Service');

class PaymentRepository {
    async create(data) {
        return await Payment.create(data);
    }

    async findAllByUserId(userId) {
        return await Payment.findAll({
            where: { user_id: userId },
            include: [{
                model: Order,
                as: 'order',
                include: [{ model: Service, as: 'service' }]
            }],
            order: [['created_at', 'DESC']]
        });
    }

    async findAll() {
        return await Payment.findAll({
            include: [{
                model: Order,
                as: 'order',
                include: [{ model: Service, as: 'service' }]
            }],
            order: [['created_at', 'DESC']]
        });
    }

    async findByOrderId(orderId) {
        return await Payment.findOne({
            where: { order_id: orderId },
            include: [{ model: Order, as: 'order' }]
        });
    }

    async findById(id) {
        return await Payment.findByPk(id, {
            include: [{ model: Order, as: 'order' }]
        });
    }
}

module.exports = new PaymentRepository();
