const http = require('http');

const EMAIL_SERVICE_URL = 'http://127.0.0.1:5001/send';

const sendEmailNotification = (emailData) => {
    const body = JSON.stringify(emailData);
    const options = {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
        },
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Email service responded with ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Email service request timed out'));
        });
        req.write(body);
        req.end();
    });
};

module.exports = { sendEmailNotification };
