const ServiceService = require('../services/ServiceService');
const logDbOperation = require('../middleware/dbLogger'); 
const { validationResult } = require('express-validator');

class ServiceController {
    async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const service = await ServiceService.createService(req.body);
            await logDbOperation('INSERT', 'services', 'SERVICE_' + service._id); 
            res.status(201).json(service);
        } catch (error) {
            console.error('Ошибка создания услуги:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const services = await ServiceService.getAllServicesWithAverageRatings();
            await logDbOperation('SELECT', 'services', 'ALL'); 
            res.status(200).json(services);
        } catch (error) {
            console.error('Ошибка получения всех услуг:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const service = await ServiceService.updateService(id, req.body);
            await logDbOperation('UPDATE', 'services', id); 
            res.status(200).json(service);
        } catch (error) {
            console.error('Ошибка обновления услуги:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            await ServiceService.deleteService(id);
            await logDbOperation('DELETE', 'services', id); 
            res.status(204).send();
        } catch (error) {
            console.error('Ошибка удаления услуги:', error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ServiceController();