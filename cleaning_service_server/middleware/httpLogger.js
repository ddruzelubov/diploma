const morgan = require('morgan');
const { HttpLog } = require('../models/Logger');

const httpLogger = morgan(':method :url :status :response-time', {
    stream: {
        write: async (message) => {
            const logParts = message.trim().split(' ');
            const method = logParts[0];
            const url = logParts[1];
            const statusCode = parseInt(logParts[2], 10);
            const responseTime = parseFloat(logParts[3]);

            try {
                await HttpLog.create({ method, url, statusCode, responseTime });
            } catch (error) {
                console.error('Error logging HTTP request:', error);
            }
        },
    },
});

module.exports = httpLogger;