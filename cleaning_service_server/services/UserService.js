const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const OrderRepository = require('../repositories/OrderRepository');
const ReviewRepository = require('../repositories/ReviewRepository');
const OrderRatingRepository = require('../repositories/OrderRatingRepository');
const PaymentRepository = require('../repositories/PaymentRepository');

class UserService {
    toPublicUser(user) {
        if (!user) return null;
        const plain = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
        delete plain.password;
        return {
            id: plain.id,
            username: plain.username,
            email: plain.email,
            role: plain.role,
        };
    }

    async register(userData) {
        const existingUser = await UserRepository.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email уже зарегистрирован');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await UserRepository.create({ ...userData, password: hashedPassword });
        return newUser;
    }

    async login(email, password) {
        const user = await UserRepository.findUserByEmailWithPassword(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
        return { user: this.toPublicUser(user), token };
    }

    async getProfile(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.toPublicUser(user);
    }

    async updateProfile(userId, { username, email, currentPassword, newPassword }) {
        const user = await UserRepository.findByIdWithPassword(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const updates = {};

        if (username !== undefined && username !== null) {
            const trimmed = String(username).trim();
            if (!trimmed) {
                throw new Error('Имя пользователя не может быть пустым');
            }
            updates.username = trimmed;
        }

        if (email !== undefined && email !== null) {
            const trimmedEmail = String(email).trim();
            const taken = await UserRepository.findAnotherUserWithEmail(trimmedEmail, userId);
            if (taken) {
                throw new Error('Этот email уже занят');
            }
            updates.email = trimmedEmail;
        }

        if (newPassword !== undefined && newPassword !== null && String(newPassword).length > 0) {
            if (!currentPassword) {
                throw new Error('Укажите текущий пароль для смены пароля');
            }
            if (String(newPassword).length < 6) {
                throw new Error('Новый пароль должен содержать минимум 6 символов');
            }
            const ok = await bcrypt.compare(currentPassword, user.password);
            if (!ok) {
                throw new Error('Неверный текущий пароль');
            }
            updates.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(updates).length === 0) {
            return this.toPublicUser(user);
        }

        const updated = await UserRepository.update(userId, updates);
        return this.toPublicUser(updated);
    }

    async getAllUsers() {
        return await UserRepository.findAll();
    }

    async getAllCleaners() {
        return await UserRepository.findAllByRole('cleaner');
    }

    async getUserById(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(id, userData) {
        return await UserRepository.update(id, userData);
    }

    async deleteUser(id) {
        try {
            const orders = await OrderRepository.findAllByUserId(id) || [];

            if (orders.length > 0) {
                const orderIds = orders.map(o => o.id);
                await PaymentRepository.deleteAllByOrderIds(orderIds);
                await Promise.all(orderIds.map(orderId => OrderRatingRepository.deleteAllByOrderId(orderId)));
                await OrderRepository.deleteAllByUserId(id);
            }

            await PaymentRepository.deleteAllByUserId(id);

            const reviews = await ReviewRepository.findAllByUserId(id) || [];
            if (reviews.length > 0) {
                await ReviewRepository.deleteAllByUserId(id);
            }

            return await UserRepository.delete(id);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Ошибка при удалении пользователя: ' + error.message);
        }
    }
}

module.exports = new UserService();
