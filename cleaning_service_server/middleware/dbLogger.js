const { DbLog } = require('../models/Logger');

const logDbOperation = async (operation, collection, documentId) => {
    await DbLog.create({ operation, collection, documentId });
};

module.exports = logDbOperation;