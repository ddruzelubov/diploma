const { Op } = require('sequelize');
const { User } = require('../models');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findAll() {
        return await User.findAll();
    }

    async findAllByRole(role) {
        return await User.findAll({ where: { role } });
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async findUserByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findUserByEmailWithPassword(email) {
        return await User.unscoped().findOne({ where: { email } });
    }

    async findByIdWithPassword(id) {
        return await User.unscoped().findByPk(id);
    }

    async findAnotherUserWithEmail(email, excludeUserId) {
        return await User.findOne({
            where: {
                email,
                id: { [Op.ne]: excludeUserId },
            },
        });
    }

    async update(id, userData) {
        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return await user.update(userData);
    }

    async delete(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return await user.destroy();
    }
}

module.exports = new UserRepository();
