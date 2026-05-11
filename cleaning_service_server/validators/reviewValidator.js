const Joi = require('joi');

const reviewSchema = {
    create: Joi.object({
    user_id: Joi.number().integer(),
    service_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).optional(),
    }),
    update: Joi.object({
        rating: Joi.number().integer().min(1).max(5).optional(),
        comment: Joi.string().max(500).optional()
    })
};

const validateReview = (type) => {
    return (req, res, next) => {
        const { error } = reviewSchema[type].validate(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    };
};

module.exports = validateReview;