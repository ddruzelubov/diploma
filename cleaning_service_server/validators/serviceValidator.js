const Joi = require('joi');

const serviceSchema = {
    create: Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().optional(),
    base_price: Joi.number().greater(0).required(),
    }),
    update: Joi.object({
        name: Joi.string().min(1).optional(),
        description: Joi.string().optional(),
        base_price: Joi.number().greater(0).optional()
    })
};  

const validateService = (type) => {
    return (req, res, next) => {
        const { error } = serviceSchema[type].validate(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
        next();
    };
};

module.exports = validateService;