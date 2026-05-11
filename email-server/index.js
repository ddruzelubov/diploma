const express = require('express');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const app = express();
const PORT = 5001;

app.use(express.json());

const sendEmail = async (emailData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
    };

    await transporter.sendMail(mailOptions);
};

const startConsumer = async () => {
    const connection = await amqp.connect('amqp://127.0.0.1');
    const channel = await connection.createChannel();
    const queue = 'emailQueue';

    await channel.assertQueue(queue, { durable: true });

    console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

    channel.consume(queue, async (msg) => {
        const emailData = JSON.parse(msg.content.toString());
        await sendEmail(emailData);
        channel.ack(msg);
    });
};

app.listen(PORT, () => {
    console.log(`Email service running on port ${PORT}`);
    startConsumer().catch(console.error);
});