const OrderService = require('../services/OrderService');
const OrderRepository = require('../repositories/OrderRepository');
const User = require('../models/User'); 
const Service = require('../models/Service'); 
const OrderRatingRepository = require('../repositories/OrderRatingRepository');

jest.mock('../repositories/OrderRepository');
jest.mock('../repositories/OrderRatingRepository');
jest.mock('../models/User');
jest.mock('../models/Service');

describe('OrderService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create an order successfully', async () => {
            const userId = 1;
            const serviceId = 1;
            const area = 50;
            const address = '123 Main St';
            const totalPrice = 500;

            User.findByPk.mockResolvedValue({ id: userId });
            Service.findByPk.mockResolvedValue({ id: serviceId, base_price: 10 });
            OrderRepository.create.mockResolvedValue({
                id: 1,
                user_id: userId,
                service_id: serviceId,
                area,
                total_price: totalPrice,
                address,
                order_date: new Date(),
                completion_date: null,
            });

            const orderData = { service_id: serviceId, area, address, completion_date: null };

            const order = await OrderService.createOrder(userId, orderData);
            expect(order).toEqual(expect.objectContaining({
                user_id: userId,
                service_id: serviceId,
                area,
                total_price: totalPrice,
                address,
            }));
            expect(OrderRepository.create).toHaveBeenCalledWith(expect.objectContaining({ user_id: userId }));
        });

        it('should throw an error if user not found', async () => {
            const userId = 1;
            const orderData = { service_id: 1, area: 50, address: '123 Main St', completion_date: null };

            User.findByPk.mockResolvedValue(null);

            await expect(OrderService.createOrder(userId, orderData)).rejects.toThrow('User not found');
        });

        it('should throw an error if service not found', async () => {
            const userId = 1;
            const orderData = { service_id: 1, area: 50, address: '123 Main St', completion_date: null };

            User.findByPk.mockResolvedValue({ id: userId });
            Service.findByPk.mockResolvedValue(null);

            await expect(OrderService.createOrder(userId, orderData)).rejects.toThrow('Service not found');
        });

        it('should throw an error if area is less than or equal to 0', async () => {
            const userId = 1;
            const orderData = { service_id: 1, area: 0, address: '123 Main St', completion_date: null };

            User.findByPk.mockResolvedValue({ id: userId });
            Service.findByPk.mockResolvedValue({ id: 1, base_price: 10 });

            await expect(OrderService.createOrder(userId, orderData)).rejects.toThrow('Area must be greater than 0');
        });
    });

    describe('getAllUserOrders', () => {
        it('should return all orders for a user', async () => {
            const userId = 1;
            const orders = [{ id: 1, user_id: userId, service_id: 1, area: 50 }];

            OrderRepository.findAllByUserId.mockResolvedValue(orders);

            const result = await OrderService.getAllUserOrders(userId);
            expect(result).toEqual(orders);
        });
    });

    describe('getAllOrders', () => {
        it('should return all orders', async () => {
            const orders = [{ id: 1, user_id: 1, service_id: 1, area: 50 }];

            OrderRepository.findAll.mockResolvedValue(orders);

            const result = await OrderService.getAllOrders();
            expect(result).toEqual(orders);
        });
    });

    describe('getOrderById', () => {
        it('should return an order by ID', async () => {
            const orderId = 1;
            const order = { id: orderId, user_id: 1, service_id: 1, area: 50 };

            OrderRepository.findById.mockResolvedValue(order);

            const result = await OrderService.getOrderById(orderId);
            expect(result).toEqual(order);
            expect(OrderRepository.findById).toHaveBeenCalledWith(orderId);
        });

        it('should throw an error if order not found', async () => {
            const orderId = 1;

            OrderRepository.findById.mockResolvedValue(null);

            await expect(OrderService.getOrderById(orderId)).rejects.toThrow('Order not found');
        });
    });

    describe('updateOrder', () => {
        it('should update an order successfully', async () => {
            const orderId = 1;
            const area = 50; 
            const orderData = { area, address: 'New Address', completion_date: null };
            const service = { id: 1, base_price: 10 }; 
            const order = { 
                id: orderId, 
                user_id: 1, 
                service_id: 1, 
                area: 30, 
                total_price: 300, 
                address: 'Old Address',
                service: service
            };
        
            OrderRepository.findById.mockResolvedValue(order);
            OrderRepository.update.mockResolvedValue({
                ...order,
                area, 
                address: 'New Address',
                total_price: service.base_price * area 
            }); 
        
            const updatedOrder = await OrderService.updateOrder(orderId, orderData);
            expect(updatedOrder).toEqual(expect.objectContaining({
                id: orderId,
                area: 50, 
                address: 'New Address',
                total_price: service.base_price * area
            }));
            expect(OrderRepository.update).toHaveBeenCalledWith(expect.objectContaining({ id: orderId }));
        });
    
        it('should throw an error if order not found', async () => {
            const orderId = 1;
    
            OrderRepository.findById.mockResolvedValue(null);
    
            await expect(OrderService.updateOrder(orderId, {})).rejects.toThrow('Order not found');
        });
    
        it('should throw an error if area is less than or equal to 0 during update', async () => {
            const orderId = 1;
            const orderData = { area: 0, address: 'New Address' };
            const order = { id: orderId, user_id: 1, service_id: 1, area: 30, total_price: 300, address: 'Old Address', service: { id: 1, base_price: 10 } };
    
            OrderRepository.findById.mockResolvedValue(order);
    
            await expect(OrderService.updateOrder(orderId, orderData)).rejects.toThrow('Area must be greater than 0');
        });
    
        it('should throw an error if service not found or has no base price', async () => {
            const orderId = 1;
            const orderData = { area: 50, address: 'New Address' };
            const order = { id: orderId, user_id: 1, service_id: 1, area: 30, total_price: 300, address: 'Old Address', service: null };
    
            OrderRepository.findById.mockResolvedValue(order);
    
            await expect(OrderService.updateOrder(orderId, orderData)).rejects.toThrow('Service not found or has no base price');
        });
    
        it('should throw an error if completion date is not later than order date', async () => {
            const orderId = 1;
            const orderData = { completion_date: '2022-01-01' };
            const order = { id: orderId, user_id: 1, service_id: 1, area: 30, total_price: 300, address: 'Old Address', order_date: '2022-01-02' };
    
            OrderRepository.findById.mockResolvedValue(order);
    
            await expect(OrderService.updateOrder(orderId, orderData)).rejects.toThrow('Completion date must be later than order date');
        });
    });
    
    describe('deleteOrder', () => {
        it('should delete an order successfully', async () => {
            const orderId = 1;
            const order = { id: orderId };
    
            OrderRepository.findById.mockResolvedValue(order);
            OrderRatingRepository.deleteAllByOrderId.mockResolvedValue(); 
            OrderRepository.delete.mockResolvedValue(order);
    
            const result = await OrderService.deleteOrder(orderId);
            expect(result).toEqual(order);
            expect(OrderRepository.delete).toHaveBeenCalledWith(orderId);
        });
    
        it('should throw an error if order not found', async () => {
            const orderId = 1;
    
            OrderRepository.findById.mockResolvedValue(null); 
    
            await expect(OrderService.deleteOrder(orderId)).rejects.toThrow('Order not found');
        });
    });
});