const amqp = require('amqplib');

const AMQP_URL = 'amqp://127.0.0.1';
const QUEUE = 'emailQueue';

const sendEmailNotification = async (emailData) => {
    const connection = await amqp.connect(AMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    channel.sendToQueue(
        QUEUE,
        Buffer.from(JSON.stringify(emailData)),
        { persistent: true }
    );
    await channel.close();
    await connection.close();
};

module.exports = { sendEmailNotification };
