const ReviewService = require('../services/ReviewService');
const logDbOperation = require('../middleware/dbLogger');

class ReviewController {
    async createReview(req, res) {
        const userId = req.user.id; 
        try {
            const review = await ReviewService.createReview(userId, req.body);
            await logDbOperation('INSERT', 'reviews', 'REVIEW_' + review._id); 
            res.status(201).json(review);
        } catch (error) {
            console.error('Error creating review:', error.message || error);
            res.status(400).json({ error: error.message });
        }
    }

    async getReviewsByServiceId(req, res) {
        const { serviceId } = req.params;
        try {
            const reviews = await ReviewService.getReviewsByServiceId(serviceId);
            
            await logDbOperation('SELECT', 'reviews', 'SERVICE_' + serviceId); 
            res.json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllUserReviews(req, res) {
        const userId = req.user.id; 
        try {
            const reviews = await ReviewService.getAllUserReviews(userId);
            await logDbOperation('SELECT', 'reviews', 'USER_' + userId); 
            res.json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllReviews(req, res) {
        try {
            const reviews = await ReviewService.getAllReviews();
            await logDbOperation('SELECT', 'reviews', 'ALL');
            res.json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getReviewById(req, res) {
        const { id } = req.params;
        try {
            const review = await ReviewService.getReviewById(id);
            await logDbOperation('SELECT', 'reviews', id); 
            res.json(review);
        } catch (error) {
            console.error('Error fetching review:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateReview(req, res) {
        const { id } = req.params;
        try {
            const review = await ReviewService.updateReview(id, req.body);
            await logDbOperation('UPDATE', 'reviews', id); 
            res.json(review);
        } catch (error) {
            console.error('Error updating review:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteReview(req, res) {
        const { id } = req.params;
        try {
            await ReviewService.deleteReview(id);
            await logDbOperation('DELETE', 'reviews', id); 
            res.status(204).send(); 
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReviewController();