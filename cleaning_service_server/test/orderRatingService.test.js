const OrderRatingService = require('../services/OrderRatingService');
const OrderRatingRepository = require('../repositories/OrderRatingRepository');
const Order = require('../models/Order');
const User = require('../models/User');

jest.mock('../repositories/OrderRatingRepository');
jest.mock('../models/Order');
jest.mock('../models/User');

describe('OrderRatingService', () => {
    describe('createOrderRating', () => {
        it('should create an order rating successfully', async () => {
            const userId = 1;
            const orderId = 1;
            const orderRatingData = { rating: 5, comment: 'Excellent service!' };
            const order = { id: orderId };
            const user = { id: userId };

            Order.findByPk.mockResolvedValue(order); 
            User.findByPk.mockResolvedValue(user); 
            OrderRatingRepository.create.mockResolvedValue({ ...orderRatingData, user_id: userId, order_id: orderId }); 

            const result = await OrderRatingService.createOrderRating(userId, orderId, orderRatingData);
            expect(result).toEqual({ ...orderRatingData, user_id: userId, order_id: orderId });
            expect(Order.findByPk).toHaveBeenCalledWith(orderId);
            expect(User.findByPk).toHaveBeenCalledWith(userId);
            expect(OrderRatingRepository.create).toHaveBeenCalledWith({
                user_id: userId,
                order_id: orderId,
                rating: orderRatingData.rating,
                comment: orderRatingData.comment,
            });
        });

        it('should throw an error if order not found', async () => {
            const userId = 1;
            const orderId = 1;
            const orderRatingData = { rating: 5, comment: 'Excellent service!' };

            Order.findByPk.mockResolvedValue(null); 

            await expect(OrderRatingService.createOrderRating(userId, orderId, orderRatingData)).rejects.toThrow('Order not found');
        });

        it('should throw an error if user not found', async () => {
            const userId = 1;
            const orderId = 1;
            const orderRatingData = { rating: 5, comment: 'Excellent service!' };
            const order = { id: orderId };

            Order.findByPk.mockResolvedValue(order); 
            User.findByPk.mockResolvedValue(null); 

            await expect(OrderRatingService.createOrderRating(userId, orderId, orderRatingData)).rejects.toThrow('User not found');
        });
    });

    describe('getAllRatingsByUserId', () => {
        it('should return all ratings for a user', async () => {
            const userId = 1;
            const ratings = [{ id: 1, user_id: userId, order_id: 1, rating: 5, comment: 'Great!' }];
            OrderRatingRepository.findAllByUserId.mockResolvedValue(ratings);

            const result = await OrderRatingService.getAllRatingsByUserId(userId);
            expect(result).toEqual(ratings);
        });
    });

    describe('getAllOrderRatings', () => {
        it('should return all order ratings', async () => {
            const ratings = [
                { id: 1, user_id: 1, order_id: 1, rating: 5, comment: 'Great!' },
                { id: 2, user_id: 2, order_id: 2, rating: 4, comment: 'Good!' }
            ];
            OrderRatingRepository.findAll.mockResolvedValue(ratings); 

            const result = await OrderRatingService.getAllOrderRatings();
            expect(result).toEqual(ratings);
        });
    });

    describe('getAllRatingsByOrderId', () => {
        it('should return all ratings for an order', async () => {
            const orderId = 1;
            const ratings = [{ id: 1, user_id: 1, order_id: orderId, rating: 5, comment: 'Great!' }];
            OrderRatingRepository.findAllByOrderId.mockResolvedValue(ratings); 

            const result = await OrderRatingService.getAllRatingsByOrderId(orderId);
            expect(result).toEqual(ratings);
        });
    });

    describe('getOrderRatingById', () => {
        it('should return an order rating by ID', async () => {
            const orderRatingId = 1;
            const rating = { id: orderRatingId, user_id: 1, order_id: 1, rating: 5, comment: 'Great!' };
            OrderRatingRepository.findById.mockResolvedValue(rating);

            const result = await OrderRatingService.getOrderRatingById(orderRatingId);
            expect(result).toEqual(rating);
        });

        it('should throw an error if rating not found', async () => {
            const orderRatingId = 1;
            OrderRatingRepository.findById.mockResolvedValue(null); 

            await expect(OrderRatingService.getOrderRatingById(orderRatingId)).rejects.toThrow('Rating not found');
        });
    });

    describe('updateOrderRating', () => {
        it('should update an order rating successfully', async () => {
            const orderRatingId = 1;
            const orderRatingData = { rating: 4, comment: 'Updated comment' };
            const existingRating = { id: orderRatingId, user_id: 1, order_id: 1, rating: 5, comment: 'Great!' };

            OrderRatingRepository.findById.mockResolvedValue(existingRating); 
            OrderRatingRepository.update.mockResolvedValue({ ...existingRating, ...orderRatingData }); 

            const result = await OrderRatingService.updateOrderRating(orderRatingId, orderRatingData);
            expect(result).toEqual({ ...existingRating, ...orderRatingData });
            expect(OrderRatingRepository.update).toHaveBeenCalledWith(existingRating);
        });

        it('should throw an error if rating not found', async () => {
            const orderRatingId = 1;
            OrderRatingRepository.findById.mockResolvedValue(null); 

            await expect(OrderRatingService.updateOrderRating(orderRatingId, {})).rejects.toThrow('Rating not found');
        });
    });

    describe('deleteOrderRating', () => {
        it('should delete an order rating successfully', async () => {
            const orderRatingId = 1;
            const rating = { id: orderRatingId };

            OrderRatingRepository.findById.mockResolvedValue(rating); 
            OrderRatingRepository.delete.mockResolvedValue(rating); 

            const result = await OrderRatingService.deleteOrderRating(orderRatingId);
            expect(result).toEqual(rating);
        });

        it('should throw an error if rating not found', async () => {
            const orderRatingId = 1;
            OrderRatingRepository.findById.mockResolvedValue(null); 

            await expect(OrderRatingService.deleteOrderRating(orderRatingId)).rejects.toThrow('Rating not found');
        });
    });
});