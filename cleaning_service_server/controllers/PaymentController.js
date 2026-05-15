const PaymentService = require('../services/PaymentService');

class PaymentController {
    async createPayment(req, res) {
        const userId = req.user.id;
        try {
            const payment = await PaymentService.createPayment(userId, req.body);
            res.status(201).json(payment);
        } catch (error) {
            console.error('Payment error:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async getUserPayments(req, res) {
        const userId = req.user.id;
        try {
            const payments = await PaymentService.getUserPayments(userId);
            res.json(payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllPayments(req, res) {
        try {
            const payments = await PaymentService.getAllPayments();
            res.json(payments);
        } catch (error) {
            console.error('Error fetching all payments:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getPaymentByOrder(req, res) {
        const { orderId } = req.params;
        try {
            const payment = await PaymentService.getPaymentByOrderId(orderId);
            if (!payment) return res.json(null);
            res.json(payment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
