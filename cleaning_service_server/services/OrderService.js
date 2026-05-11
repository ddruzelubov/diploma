const OrderRepository = require('../repositories/OrderRepository');
const User = require('../models/User');
const Service = require('../models/Service');
const OrderRatingRepository = require('../repositories/OrderRatingRepository');
const sequelize = require('../config/database');

class OrderService {
    async createOrder(userId, orderData) {
        const {service_id, area, address, order_date } = orderData;

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const service = await Service.findByPk(service_id);
        if (!service) {
            throw new Error('Service not found');
        }

        if (area <= 0) {
            throw new Error('Area must be greater than 0');
        }

        const total_price = service.base_price * area;

        return await OrderRepository.create({
            user_id: userId,
            service_id,
            area,
            total_price,
            address,
            order_date
        });
    }

    async getAllUserOrders(userId) {
        return await OrderRepository.findAllByUserId(userId);
    }

    async getAllOrders() {
        return await OrderRepository.findAll();
    }

    async getOrderById(orderId) {
        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async updateOrder(orderId, orderData) {
        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
    
        const { area, address, completion_date } = orderData;
    
        if (area !== undefined) {
            if (area <= 0) {
                throw new Error('Area must be greater than 0');
            }
            order.area = area;

            if (order.service && order.service.base_price) {
                order.total_price = order.service.base_price * area; 
            } else {
                throw new Error('Service not found or has no base price');
            }
        }
    
        if (address) {
            order.address = address;
        }
    
        if (completion_date) {
            if (new Date(completion_date) <= new Date(order.order_date)) {
                throw new Error('Completion date must be later than order date');
            }
            order.completion_date = completion_date;
        }
    
        const updatedOrder = await OrderRepository.update(order);
        return updatedOrder; 
    }

    async deleteOrder(id) {
        const order = await OrderRepository.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }

        await OrderRatingRepository.deleteAllByOrderId(id); 
        return await OrderRepository.delete(id);
    }
}

module.exports = new OrderService();