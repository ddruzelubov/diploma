const { Service } = require('../models');

class ServiceRepository {
    async create(serviceData) {
        return await Service.create(serviceData);
    }

    async findAll() {
        return await Service.findAll();
    }

    async findById(id) {
        return await Service.findByPk(id);
    }

    async update(id, serviceData) {
        const service = await this.findById(id);
        return await service.update(serviceData);
    }

    async delete(id) {
        const service = await this.findById(id);
        return await service.destroy();
    }
}

module.exports = new ServiceRepository();