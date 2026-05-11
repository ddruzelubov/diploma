const Joi = require('joi');

const orderRatingSchema = {
    create: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).optional(),
    }),
    update: Joi.object({
        rating: Joi.number().integer().min(1).max(5).optional(),
        comment: Joi.string().max(500).optional()
    })
};

const validateOrderRating = (type) => {
    return (req, res, next) => {
        const { error } = orderRatingSchema[type].validate(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    };
};

module.exports = validateOrderRating;