const Joi = require('joi');

const orderSchema = {
    create: Joi.object({
        user_id: Joi.number().integer(),
        service_id: Joi.number().integer().required(),
        area: Joi.number().greater(0).required(),
        total_price: Joi.number().greater(0),
        address: Joi.string().required(),
        order_date: Joi.date().required()
    }),
    update: Joi.object({
        area: Joi.number().greater(0).optional(),
        total_price: Joi.number().greater(0).optional(),
        address: Joi.string().optional(),
        order_date: Joi.date().optional(),
        completion_date: Joi.date().optional(),
        status: Joi.string().valid('pending', 'assigned', 'in_progress', 'completed').optional()
    })
};

const validateOrder = (type) => {
    return (req, res, next) => {
        const { error } = orderSchema[type].validate(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    };
};

module.exports = validateOrder;
