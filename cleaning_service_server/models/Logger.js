const mongoose = require('mongoose');

const httpLogSchema = new mongoose.Schema({
    method: { type: String, required: true },
    url: { type: String, required: true },
    statusCode: { type: Number, required: true },
    responseTime: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const dbLogSchema = new mongoose.Schema({
    operation: { type: String, required: true },
    collection: { type: String, required: true },
    documentId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const HttpLog = mongoose.model('HttpLog', httpLogSchema);
const DbLog = mongoose.model('DbLog', dbLogSchema);

module.exports = { HttpLog, DbLog };