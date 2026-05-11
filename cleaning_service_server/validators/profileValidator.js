const { body, validationResult } = require('express-validator');

const validateProfileUpdate = [
    body('username').optional().isString().trim().notEmpty().withMessage('Имя пользователя не может быть пустым'),
    body('email').optional().isEmail().withMessage('Некорректный email'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('Новый пароль — минимум 6 символов'),
    body('currentPassword').optional().isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (req.body.newPassword && !req.body.currentPassword) {
            return res.status(400).json({ error: 'Для смены пароля укажите текущий пароль' });
        }
        next();
    },
];

module.exports = validateProfileUpdate;
