const UserService = require('../services/UserService');
const logDbOperation = require('../middleware/dbLogger');
const amqp = require('amqplib');

class UserController {
    async register(req, res) {
        const { username, email, password, role } = req.body;
        try {
            const newUser = await UserService.register({ username, email, password, role });
            await logDbOperation('INSERT', 'users', 'USER_' + newUser._id); 

            const emailData = {
                to: email,
                subject: 'Добро пожаловать!',
                text: `Здравствуйте, ${username}! Спасибо за регистрацию.`,
            };

            try {
                const connection = await amqp.connect('amqp://127.0.0.1');
                const channel = await connection.createChannel();
                const queue = 'emailQueue';

                await channel.assertQueue(queue, { durable: true });
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
                    persistent: true,
                });
                await channel.close();
                await connection.close();
                console.log('Email message sent to queue:', emailData);
            } catch (queueErr) {
                console.warn('Очередь email недоступна, регистрация всё равно выполнена:', queueErr.message);
            }

            res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async getMe(req, res) {
        try {
            const profile = await UserService.getProfile(req.user.id);
            res.status(200).json(profile);
        } catch (error) {
            console.error('Ошибка профиля:', error);
            res.status(404).json({ error: error.message });
        }
    }

    async updateMe(req, res) {
        try {
            const { username, email, currentPassword, newPassword } = req.body;
            const profile = await UserService.updateProfile(req.user.id, {
                username,
                email,
                currentPassword,
                newPassword,
            });
            res.status(200).json(profile);
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const { user, token } = await UserService.login(email, password);
            res.status(200).json({ user, token });
        } catch (error) {
            console.error('Ошибка при входе:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const users = await UserService.getAllUsers();
            await logDbOperation('SELECT', 'users', 'ALL'); 
            res.status(200).json(users);
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await UserService.getUserById(id);
            await logDbOperation('SELECT', 'users', id); 
            res.status(200).json(user);
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
            res.status(404).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        try {
            const updatedUser = await UserService.updateUser(id, req.body);
            await logDbOperation('UPDATE', 'users', id); 
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await UserService.deleteUser(id);
            await logDbOperation('DELETE', 'users', id); 
            res.status(204).send(); 
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UserController();