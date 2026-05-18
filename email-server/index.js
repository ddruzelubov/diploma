const express = require('express');
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

app.post('/send', async (req, res) => {
    const { to, subject, text, html } = req.body;
    if (!to || !subject) {
        return res.status(400).json({ error: 'Missing required fields: to, subject' });
    }
    try {
        await transporter.sendMail({
            from: `"CleanSpace" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            ...(html && { html }),
        });
        console.log(`[email] Sent to ${to} — ${subject}`);
        res.json({ ok: true });
    } catch (err) {
        console.error('[email] Send error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '127.0.0.1', () => {
    console.log(`[email] Service running on port ${PORT}`);
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('[email] WARNING: EMAIL_USER or EMAIL_PASS not set — emails will fail');
    } else {
        console.log(`[email] Sending from: ${process.env.EMAIL_USER}`);
    }
});
