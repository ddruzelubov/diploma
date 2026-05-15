const crypto = require('crypto');
const PaymentRepository = require('../repositories/PaymentRepository');
const OrderRepository = require('../repositories/OrderRepository');

class PaymentService {
    async createPayment(userId, { order_id, payment_method }) {
        const order = await OrderRepository.findById(parseInt(order_id));
        if (!order) throw new Error('Заказ не найден');
        if (order.user_id !== parseInt(userId)) throw new Error('Доступ запрещён');
        if (order.status === 'completed') throw new Error('Нельзя оплатить выполненный заказ');

        const existing = await PaymentRepository.findByOrderId(order_id);
        if (existing) throw new Error('Заказ уже оплачен');

        const payment = await PaymentRepository.create({
            order_id,
            user_id: userId,
            amount: order.total_price,
            status: 'paid',
            payment_method: payment_method || 'card',
            transaction_id: crypto.randomUUID()
        });

        return payment;
    }

    async getUserPayments(userId) {
        return await PaymentRepository.findAllByUserId(userId);
    }

    async getAllPayments() {
        return await PaymentRepository.findAll();
    }

    async getPaymentByOrderId(orderId) {
        return await PaymentRepository.findByOrderId(orderId);
    }
}

module.exports = new PaymentService();
