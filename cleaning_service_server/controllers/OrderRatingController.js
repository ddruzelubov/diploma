const OrderRatingService = require('../services/OrderRatingService');
const logDbOperation = require('../middleware/dbLogger');

class OrderRatingController {
    async createOrderRating(req, res) {
        const userId = req.user.id; 
        const { orderId } = req.params; 

        try {
            const orderRating = await OrderRatingService.createOrderRating(userId, orderId, req.body);
            await logDbOperation('INSERT', 'orderRatings', 'ORDERRATING_' + orderRating._id); 
            res.status(201).json(orderRating);
        } catch (error) {
            console.error('Error creating order rating:', error.message || error);
            res.status(400).json({ error: error.message });
        }
    }

    async getAllOrderRatings(req, res) {
        try {
            const ratings = await OrderRatingService.getAllOrderRatings();
            await logDbOperation('SELECT', 'orderRatings', 'ALL');
            res.json(ratings);
        } catch (error) {
            console.error('Error fetching all order ratings:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllRatingsByUserId(req, res) {
        const userId = req.user.id; 
        try {
            const ratings = await OrderRatingService.getAllRatingsByUserId(userId);
            await logDbOperation('SELECT', 'orderRatings', 'USER_' + userId); 
            res.json(ratings);
        } catch (error) {
            console.error('Error fetching ratings by user ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllRatingsByOrderId(req, res) {
        const { orderId } = req.params; 
        try {
            const ratings = await OrderRatingService.getAllRatingsByOrderId(orderId);
            await logDbOperation('SELECT', 'orderRatings', 'ORDER_' + orderId); 
            res.json(ratings);
        } catch (error) {
            console.error('Error fetching order ratings:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getOrderRatingById(req, res) {
        const { id } = req.params;
        try {
            const rating = await OrderRatingService.getOrderRatingById(id);
            await logDbOperation('SELECT', 'orderRatings', id);
            res.json(rating);
        } catch (error) {
            console.error('Error fetching order rating:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateOrderRating(req, res) {
        const { id } = req.params;
        try {
            const rating = await OrderRatingService.updateOrderRating(id, req.body);
            await logDbOperation('UPDATE', 'orderRatings', id); 
            res.json(rating);
        } catch (error) {
            console.error('Error updating order rating:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteOrderRating(req, res) {
        const { id } = req.params;
        try {
            await OrderRatingService.deleteOrderRating(id);
            await logDbOperation('DELETE', 'orderRatings', id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting order rating:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderRatingController();