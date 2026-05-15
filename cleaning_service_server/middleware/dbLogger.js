const { DbLog } = require('../models/Logger');

const logDbOperation = (operation, collection, documentId) => {
    DbLog.create({ operation, collection, documentId }).catch(() => {});
};

module.exports = logDbOperation;
