const express = require('express');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (emailData) => {
    const mailOptions = {
        from: `"CleanSpace" <${process.env.EMAIL_USER}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        ...(emailData.html && { html: emailData.html }),
    };
    await transporter.sendMail(mailOptions);
    console.log(`[email] Sent to ${emailData.to} — ${emailData.subject}`);
};

const RECONNECT_DELAY_MS = 5000;

const startConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://127.0.0.1');
        const channel = await connection.createChannel();
        const queue = 'emailQueue';

        await channel.assertQueue(queue, { durable: true });
        channel.prefetch(1);

        console.log(`[email] Waiting for messages in queue: ${queue}`);

        connection.on('error', (err) => {
            console.error('[email] RabbitMQ connection error:', err.message);
        });

        connection.on('close', () => {
            console.warn('[email] RabbitMQ connection closed — reconnecting in 5s...');
            setTimeout(startConsumer, RECONNECT_DELAY_MS);
        });

        channel.consume(queue, async (msg) => {
            if (!msg) return;
            try {
                const emailData = JSON.parse(msg.content.toString());
                await sendEmail(emailData);
                channel.ack(msg);
            } catch (err) {
                console.error('[email] Failed to send email:', err.message);
                channel.nack(msg, false, false);
            }
        });
    } catch (err) {
        console.error('[email] Could not connect to RabbitMQ:', err.message, '— retrying in 5s...');
        setTimeout(startConsumer, RECONNECT_DELAY_MS);
    }
};

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`[email] Service running on port ${PORT}`);
    startConsumer();
});
