const express = require('express');
const UserController = require('../controllers/UserController');
const ServiceController = require('../controllers/ServiceController');
const OrderController = require('../controllers/OrderController');
const ReviewController = require('../controllers/ReviewController');
const OrderRatingController = require('../controllers/OrderRatingController');
const validateUser = require('../validators/userValidator');
const validateProfileUpdate = require('../validators/profileValidator');
const validateService = require('../validators/serviceValidator');
const validateOrder = require('../validators/orderValidator');
const validateReview = require('../validators/reviewValidator');
const validateOrderRating = require('../validators/orderRatingValidator');
const auth = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/register', validateUser, UserController.register);
router.post('/login', UserController.login);
router.get('/users/me', auth(), UserController.getMe);
router.put('/users/me', auth(), validateProfileUpdate, UserController.updateMe);
router.get('/users', auth(['admin']), UserController.getAll); 
router.delete('/user/:id', auth(['admin']), UserController.deleteUser);

// Service routes
router.post('/services', auth(['admin']), validateService('create'), ServiceController.create);
router.get('/services', ServiceController.getAll);
router.put('/services/:id', auth(['admin']), validateService('update'), ServiceController.update);
router.delete('/services/:id', auth(['admin']), ServiceController.delete);

// Order routes
router.post('/orders', auth(), validateOrder('create'), OrderController.createOrder); 
router.get('/orders', auth(), OrderController.getAllUserOrders);
router.get('/orders/all', auth(['admin']), OrderController.getAllOrders);
router.get('/orders/:id', auth(), OrderController.getOrderById);
router.put('/orders/:id', auth(), validateOrder('update'), OrderController.updateOrder);
router.delete('/orders/:id', auth(), OrderController.deleteOrder); 

// Review routes
router.post('/reviews', auth(), validateReview('create'), ReviewController.createReview);
router.get('/reviews', auth(), ReviewController.getAllUserReviews);
router.get('/reviews/all', auth(['admin']), ReviewController.getAllReviews);
router.get('/reviews/:serviceId', ReviewController.getReviewsByServiceId);
router.get('/review/:id', auth(), ReviewController.getReviewById);
router.put('/reviews/:id', auth(), validateReview('update'), ReviewController.updateReview);
router.delete('/reviews/:id', auth(), ReviewController.deleteReview); 

// OrderRating routes
router.post('/orders/:orderId/ratings', auth(), validateOrderRating('create'), OrderRatingController.createOrderRating);
router.get('/orders/:orderId/ratings', OrderRatingController.getAllRatingsByOrderId);
router.get('/userRatings', auth(), OrderRatingController.getAllRatingsByUserId);
router.get('/ratings', OrderRatingController.getAllOrderRatings);
router.get('/ratings/:id', OrderRatingController.getOrderRatingById);
router.put('/ratings/:id', auth(), validateOrderRating('update'), OrderRatingController.updateOrderRating);
router.delete('/ratings/:id', auth(), OrderRatingController.deleteOrderRating); 

module.exports = router;