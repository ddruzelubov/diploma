const Joi = require('joi');

const paymentSchema = {
    create: Joi.object({
        order_id: Joi.number().integer().required(),
        payment_method: Joi.string().valid('card', 'bank_transfer').optional()
    })
};

const validatePayment = (type) => (req, res, next) => {
    const { error } = paymentSchema[type].validate(req.body);
    if (error) {
        return res.status(400).json({ errors: error.details.map(e => e.message) });
    }
    next();
};

module.exports = validatePayment;
