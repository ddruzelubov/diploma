const ReviewRepository = require('../repositories/ReviewRepository');
const User = require('../models/User');
const Service = require('../models/Service');

class ReviewService {
    async createReview(userId, reviewData) {
        const { service_id, rating, comment } = reviewData;
    
        console.log('Creating review with:', { userId, service_id, rating, comment });
    
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
    
        const service = await Service.findByPk(service_id);
        if (!service) {
            throw new Error('Service not found');
        }
    
        return await ReviewRepository.create({
            user_id: userId,
            service_id,
            rating,
            comment
        });
    }


    async getAllUserReviews(userId) {
        return await ReviewRepository.findAllByUserId(userId);
    }

    async getAllReviews() {
        return await ReviewRepository.findAll();
    }

    async getReviewById(reviewId) {
        const review = await ReviewRepository.findById(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        return review;
    }

    async getReviewsByServiceId(serviceId){
        const reviews = await ReviewRepository.findAllByServiceId(serviceId) || [];
        if (reviews.length === 0) {
            throw new Error('Review not found');
        }
        return reviews;
    }

    async updateReview(reviewId, reviewData) {
        const review = await ReviewRepository.findById(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }

        if (reviewData.rating) {
            review.rating = reviewData.rating;
        }
        if (reviewData.comment) {
            review.comment = reviewData.comment;
        }

        return await ReviewRepository.update(review);
    }

    async deleteReview(reviewId) {
        const review = await ReviewRepository.findById(reviewId);
        if (!review) {
            throw new Error('Review not found');
        }
        return await ReviewRepository.delete(review);
    }
}

module.exports = new ReviewService();