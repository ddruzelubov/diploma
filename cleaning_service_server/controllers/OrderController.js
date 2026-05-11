const OrderService = require('../services/OrderService');
const logDbOperation = require('../middleware/dbLogger');

class OrderController {
    async createOrder(req, res) {
        const user_id = req.user.id; 
        try {
            const order = await OrderService.createOrder(user_id, req.body);
            await logDbOperation('INSERT', 'orders', 'ORDER_' + order._id); 
            res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error.message || error);
            res.status(400).json({ error: error.message });
        }
    }

    async getAllUserOrders(req, res) {
        const userId = req.user.id; 
        try {
            const orders = await OrderService.getAllUserOrders(userId);
            await logDbOperation('SELECT', 'orders', 'USER_' + userId); 
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            await logDbOperation('SELECT', 'orders', 'ALL'); 
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getOrderById(req, res) {
        const { id } = req.params;
        try {
            const order = await OrderService.getOrderById(id);
            await logDbOperation('SELECT', 'orders', id); 
            res.json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateOrder(req, res) {
        const { id } = req.params;
        try {
            const order = await OrderService.updateOrder(id, req.body);
            await logDbOperation('UPDATE', 'orders', id); 
            res.json(order);
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteOrder(req, res) {
        const { id } = req.params;
        try {
            await OrderService.deleteOrder(id);
            await logDbOperation('DELETE', 'orders', id); 
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderController();