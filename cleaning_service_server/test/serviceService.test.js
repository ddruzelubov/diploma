const ServiceService = require('../services/ServiceService');
const ServiceRepository = require('../repositories/ServiceRepository');
const ReviewRepository = require('../repositories/ReviewRepository');
const OrderRepository = require('../repositories/OrderRepository');
const OrderRatingRepository = require('../repositories/OrderRatingRepository');

jest.mock('../repositories/ServiceRepository');
jest.mock('../repositories/ReviewRepository');
jest.mock('../repositories/OrderRepository');
jest.mock('../repositories/OrderRatingRepository');

describe('ServiceService', () => {
    describe('createService', () => {
        it('should create a service successfully', async () => {
            const serviceData = { name: 'Test Service', description: 'Service description' };
            ServiceRepository.create.mockResolvedValue(serviceData);

            const result = await ServiceService.createService(serviceData);
            expect(result).toEqual(serviceData);
            expect(ServiceRepository.create).toHaveBeenCalledWith(serviceData);
        });
    });

    describe('getAllServices', () => {
        it('should return all services', async () => {
            const services = [
                { id: 1, name: 'Service 1', description: 'Description 1' },
                { id: 2, name: 'Service 2', description: 'Description 2' }
            ];
            ServiceRepository.findAll.mockResolvedValue(services);

            const result = await ServiceService.getAllServices();
            expect(result).toEqual(services);
        });
    });

    describe('updateService', () => {
        it('should update a service successfully', async () => {
            const serviceId = 1;
            const serviceData = { name: 'Updated Service', description: 'Updated description' };
            ServiceRepository.update.mockResolvedValue(serviceData);

            const result = await ServiceService.updateService(serviceId, serviceData);
            expect(result).toEqual(serviceData);
            expect(ServiceRepository.update).toHaveBeenCalledWith(serviceId, serviceData);
        });
    });

    describe('deleteService', () => {
        it('should delete a service successfully', async () => {
            const serviceId = 1;

            OrderRatingRepository.deleteAllByServiceId.mockResolvedValue();
            OrderRepository.deleteAllByServiceId.mockResolvedValue();
            ReviewRepository.deleteAllByServiceId.mockResolvedValue();
            ServiceRepository.delete.mockResolvedValue(serviceId);

            const result = await ServiceService.deleteService(serviceId);
            expect(result).toEqual(undefined); 
            expect(OrderRatingRepository.deleteAllByServiceId).toHaveBeenCalledWith(serviceId);
            expect(OrderRepository.deleteAllByServiceId).toHaveBeenCalledWith(serviceId);
            expect(ReviewRepository.deleteAllByServiceId).toHaveBeenCalledWith(serviceId);
            expect(ServiceRepository.delete).toHaveBeenCalledWith(serviceId);
        });

        it('should throw an error if service deletion fails', async () => {
            const serviceId = 1;
            OrderRatingRepository.deleteAllByServiceId.mockResolvedValue();
            OrderRepository.deleteAllByServiceId.mockResolvedValue();
            ReviewRepository.deleteAllByServiceId.mockResolvedValue();
            ServiceRepository.delete.mockRejectedValue(new Error('Deletion error')); 

            await expect(ServiceService.deleteService(serviceId)).rejects.toThrow('Ошибка при удалении услуги: Deletion error');
        });
    });
});