const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/loggingDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 3000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.warn('MongoDB not available, logging disabled:', error.message);
    }
};

module.exports = connectDB;
