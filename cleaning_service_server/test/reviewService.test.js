const ReviewService = require('../services/ReviewService');
const ReviewRepository = require('../repositories/ReviewRepository');
const User = require('../models/User');
const Service = require('../models/Service');

jest.mock('../repositories/ReviewRepository');
jest.mock('../models/User');
jest.mock('../models/Service');

describe('ReviewService', () => {
    describe('createReview', () => {
        it('should create a review successfully', async () => {
            const userId = 1;
            const serviceId = 1;
            const reviewData = { service_id: serviceId, rating: 5, comment: 'Great service!' };
            const user = { id: userId };
            const service = { id: serviceId };

            User.findByPk.mockResolvedValue(user);
            Service.findByPk.mockResolvedValue(service);
            ReviewRepository.create.mockResolvedValue({ ...reviewData, user_id: userId });

            const result = await ReviewService.createReview(userId, reviewData);
            expect(result).toEqual({ ...reviewData, user_id: userId });
            expect(User.findByPk).toHaveBeenCalledWith(userId);
            expect(Service.findByPk).toHaveBeenCalledWith(serviceId);
            expect(ReviewRepository.create).toHaveBeenCalledWith({ user_id: userId, service_id: serviceId, rating: reviewData.rating, comment: reviewData.comment });
        });

        it('should throw an error if user not found', async () => {
            const userId = 1;
            const reviewData = { service_id: 1, rating: 5, comment: 'Great service!' };

            User.findByPk.mockResolvedValue(null);

            await expect(ReviewService.createReview(userId, reviewData)).rejects.toThrow('User not found');
        });

        it('should throw an error if service not found', async () => {
            const userId = 1;
            const serviceId = 1;
            const reviewData = { service_id: serviceId, rating: 5, comment: 'Great service!' };
            const user = { id: userId };

            User.findByPk.mockResolvedValue(user);
            Service.findByPk.mockResolvedValue(null);

            await expect(ReviewService.createReview(userId, reviewData)).rejects.toThrow('Service not found');
        });
    });

    describe('getAllUserReviews', () => {
        it('should return all reviews for a user', async () => {
            const userId = 1;
            const reviews = [{ id: 1, user_id: userId, service_id: 1, rating: 5, comment: 'Great service!' }];
            ReviewRepository.findAllByUserId.mockResolvedValue(reviews);

            const result = await ReviewService.getAllUserReviews(userId);
            expect(result).toEqual(reviews);
            expect(ReviewRepository.findAllByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('getAllReviews', () => {
        it('should return all reviews', async () => {
            const reviews = [{ id: 1, user_id: 1, service_id: 1, rating: 5, comment: 'Great service!' }];
            ReviewRepository.findAll.mockResolvedValue(reviews);

            const result = await ReviewService.getAllReviews();
            expect(result).toEqual(reviews);
            expect(ReviewRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('getReviewById', () => {
        it('should return a review by ID', async () => {
            const reviewId = 1;
            const review = { id: reviewId, user_id: 1, service_id: 1, rating: 5, comment: 'Great service!' };
            ReviewRepository.findById.mockResolvedValue(review);

            const result = await ReviewService.getReviewById(reviewId);
            expect(result).toEqual(review);
            expect(ReviewRepository.findById).toHaveBeenCalledWith(reviewId);
        });

        it('should throw an error if review not found', async () => {
            const reviewId = 1;
            ReviewRepository.findById.mockResolvedValue(null);

            await expect(ReviewService.getReviewById(reviewId)).rejects.toThrow('Review not found');
        });
    });

    describe('getReviewsByServiceId', () => {
        it('should return reviews for a service', async () => {
            const serviceId = 1;
            const reviews = [{ id: 1, service_id: serviceId, rating: 5, comment: 'Great service!' }];
            ReviewRepository.findAllByServiceId.mockResolvedValue(reviews);

            const result = await ReviewService.getReviewsByServiceId(serviceId);
            expect(result).toEqual(reviews);
            expect(ReviewRepository.findAllByServiceId).toHaveBeenCalledWith(serviceId);
        });

        it('should throw an error if no reviews found for a service', async () => {
            const serviceId = 1;
            ReviewRepository.findAllByServiceId.mockResolvedValue([]);

            await expect(ReviewService.getReviewsByServiceId(serviceId)).rejects.toThrow('Review not found');
        });
    });

    describe('updateReview', () => {
        it('should update a review successfully', async () => {
            const reviewId = 1;
            const reviewData = { rating: 4, comment: 'Updated comment' };
            const existingReview = { id: reviewId, user_id: 1, service_id: 1, rating: 5, comment: 'Great service!' };

            ReviewRepository.findById.mockResolvedValue(existingReview);
            ReviewRepository.update.mockResolvedValue({ ...existingReview, ...reviewData });

            const result = await ReviewService.updateReview(reviewId, reviewData);
            expect(result).toEqual({ ...existingReview, ...reviewData });
            expect(ReviewRepository.update).toHaveBeenCalledWith({ ...existingReview, ...reviewData });
        });

        it('should throw an error if review not found', async () => {
            const reviewId = 1;
            ReviewRepository.findById.mockResolvedValue(null);

            await expect(ReviewService.updateReview(reviewId, {})).rejects.toThrow('Review not found');
        });
    });

    describe('deleteReview', () => {
        it('should delete a review successfully', async () => {
            const reviewId = 1;
            const review = { id: reviewId };

            ReviewRepository.findById.mockResolvedValue(review);
            ReviewRepository.delete.mockResolvedValue(review);

            const result = await ReviewService.deleteReview(reviewId);
            expect(result).toEqual(review);
            expect(ReviewRepository.delete).toHaveBeenCalledWith(review);
        });

        it('should throw an error if review not found', async () => {
            const reviewId = 1;
            ReviewRepository.findById.mockResolvedValue(null);

            await expect(ReviewService.deleteReview(reviewId)).rejects.toThrow('Review not found');
        });
    });
});