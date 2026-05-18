const ServiceRepository = require('../repositories/ServiceRepository');
const ReviewRepository = require('../repositories/ReviewRepository');
const OrderRepository = require('../repositories/OrderRepository');
const OrderRatingRepository = require('../repositories/OrderRatingRepository');
const PaymentRepository = require('../repositories/PaymentRepository');

class ServiceService {
    async createService(serviceData) {
        return await ServiceRepository.create(serviceData);
    }

    async getAllServices() {
        return await ServiceRepository.findAll();
    }

    async updateService(id, serviceData) {
        return await ServiceRepository.update(id, serviceData);
    }

    async deleteService(id) {
        try {
            const orders = await OrderRepository.findAllByServiceId ? await OrderRepository.findAllByServiceId(id) : [];

            if (orders && orders.length > 0) {
                const orderIds = orders.map(o => o.id);
                await PaymentRepository.deleteAllByOrderIds(orderIds);
            }

            await OrderRatingRepository.deleteAllByServiceId(id);
            await OrderRepository.deleteAllByServiceId(id);
            await ReviewRepository.deleteAllByServiceId(id);
            await ServiceRepository.delete(id);
        } catch (error) {
            throw new Error('Ошибка при удалении услуги: ' + error.message);
        }
    }

    async getAllServicesWithAverageRatings() {
        const services = await ServiceRepository.findAll();

        const servicesWithRatings = await Promise.all(services.map(async (service) => {
            const ratings = await ReviewRepository.findAllByServiceId(service.id);
            const totalRating = ratings.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = ratings.length ? (totalRating / ratings.length).toFixed(1) : 0;

            return {
                ...service.toJSON(),
                averageRating,
            };
        }));

        return servicesWithRatings;
    }
}

module.exports = new ServiceService();
