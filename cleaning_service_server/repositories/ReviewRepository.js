const Review = require('../models/Review');
const Service = require('../models/Service');

class ReviewRepository {
    static async create(reviewData) {
        return await Review.create(reviewData);
    }

    static async findAllByUserId(userId) {
        return await Review.findAll({
            where: { user_id: userId },
            include: [{ model: Service }]
        });
    }

    static async findAllByServiceId(serviceId) {
        return await Review.findAll({
            where: { service_id: serviceId },
            include: [{ model: Service }]
        });
    }

    static async findAll(){
        return await Review.findAll();
    }

    static async findById(reviewId) {
        return await Review.findByPk(reviewId, { include: [{ model: Service }] });
    }

    static async update(review) {
        return await review.save();
    }

    static async delete(review) {
        return await review.destroy();
    }

    static async deleteAllByUserId(userId) {
        return await Review.destroy({ where: { user_id: userId }});
    }

    static async deleteAllByServiceId(serviceId) {
        return await Review.destroy({ where: { service_id: serviceId }});
    }
}

module.exports = ReviewRepository;