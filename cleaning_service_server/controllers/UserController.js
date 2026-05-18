const UserService = require('../services/UserService');
const logDbOperation = require('../middleware/dbLogger');
const { sendEmailNotification } = require('../utils/emailPublisher');
const { welcomeEmail } = require('../utils/emailTemplates');

class UserController {
    async register(req, res) {
        const { username, email, password, role } = req.body;
        try {
            const newUser = await UserService.register({ username, email, password, role });
            await logDbOperation('INSERT', 'users', 'USER_' + newUser.id);

            try {
                await sendEmailNotification(welcomeEmail({ username, email }));
            } catch (queueErr) {
                console.warn('Очередь email недоступна:', queueErr.message);
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
            res.status(404).json({ error: error.message });
        }
    }

    async updateMe(req, res) {
        try {
            const { username, email, currentPassword, newPassword } = req.body;
            const profile = await UserService.updateProfile(req.user.id, { username, email, currentPassword, newPassword });
            res.status(200).json(profile);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const { user, token } = await UserService.login(email, password);
            res.status(200).json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const users = await UserService.getAllUsers();
            await logDbOperation('SELECT', 'users', 'ALL');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCleaners(req, res) {
        try {
            const cleaners = await UserService.getAllCleaners();
            res.status(200).json(cleaners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createCleaner(req, res) {
        const { username, email, password } = req.body;
        try {
            const newUser = await UserService.register({ username, email, password, role: 'cleaner' });
            await logDbOperation('INSERT', 'users', 'CLEANER_' + newUser.id);
            res.status(201).json({ message: 'Клинер успешно добавлен.' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await UserService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        if (req.user.id === parseInt(id, 10)) {
            return res.status(403).json({ error: 'Нельзя удалить собственный аккаунт.' });
        }
        try {
            await UserService.deleteUser(id);
            logDbOperation('DELETE', 'users', id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UserController();
