const header = `
<div style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:28px 40px;">
  <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">✦ CleanSpace</h1>
  <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px;">Клининг премиум-класса</p>
</div>`;

const footer = `
<div style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#9ca3af;">
  © 2026 CleanSpace. Все права защищены.
</div>`;

const wrap = (body) => `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
    ${header}
    <div style="padding:32px 40px;">${body}</div>
    ${footer}
  </div>
</body>
</html>`;

const row = (label, value) =>
    `<tr>
      <td style="padding:8px 0;color:#6b7280;font-size:14px;width:160px;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${value}</td>
    </tr>`;

const METHOD_LABELS = {
    card: 'Банковская карта',
    bank_transfer: 'Банковский перевод',
};

const welcomeEmail = ({ username, email }) => ({
    to: email,
    subject: `Добро пожаловать в CleanSpace, ${username}!`,
    text: `Здравствуйте, ${username}! Спасибо за регистрацию в CleanSpace. Теперь вы можете заказывать уборку онлайн и следить за статусом через личный кабинет.`,
    html: wrap(`
      <h2 style="margin:0 0 8px;font-size:20px;">Рады видеть вас в CleanSpace!</h2>
      <p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6;">
        Здравствуйте, <strong>${username}</strong>! Вы успешно зарегистрировались.<br>
        Теперь вы можете заказывать профессиональный клининг, отслеживать статус заказов и управлять профилем в личном кабинете.
      </p>
      <div style="background:#f0fdfa;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#0f766e;line-height:1.6;">
          🧹 <strong>Выберите услугу</strong> в каталоге<br>
          📋 <strong>Оформите заказ</strong> — укажите адрес и площадь<br>
          ✅ <strong>Следите за статусом</strong> в разделе «Мои заказы»
        </p>
      </div>
      <p style="margin:0;font-size:13px;color:#9ca3af;">Ваш email для входа: <strong style="color:#111827;">${email}</strong></p>
    `),
});

const orderConfirmationEmail = ({ email, username, orderId, serviceName, address, area, totalPrice, orderDate }) => ({
    to: email,
    subject: `Заказ №${orderId} оформлен — CleanSpace`,
    text: `Здравствуйте, ${username}! Ваш заказ №${orderId} успешно оформлен. Услуга: ${serviceName || `Заказ №${orderId}`}. Адрес: ${address}. Площадь: ${area} м². Стоимость: ${parseFloat(totalPrice).toFixed(2)} Br.`,
    html: wrap(`
      <h2 style="margin:0 0 6px;font-size:20px;">Заказ №${orderId} оформлен</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Здравствуйте, <strong>${username}</strong>! Ваш заказ принят и ожидает назначения клинера.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>
          ${row('Номер заказа', `№${orderId}`)}
          ${row('Услуга', serviceName || '—')}
          ${row('Адрес', address)}
          ${row('Площадь', `${area} м²`)}
          ${row('Дата заказа', new Date(orderDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }))}
          <tr><td colspan="2" style="padding:6px 0;border-top:1px solid #e5e7eb;"></td></tr>
          ${row('К оплате', `<span style="font-size:18px;color:#0d9488;">${parseFloat(totalPrice).toFixed(2)} Br</span>`)}
        </tbody>
      </table>
      <div style="background:#fefce8;border-radius:10px;padding:14px 18px;font-size:13px;color:#92400e;">
        ⏳ Статус заказа изменится на «Назначен» после того, как мы подберём клинера. Следите за обновлениями в личном кабинете.
      </div>
    `),
});

const paymentReceiptEmail = ({ email, username, orderId, serviceName, address, amount, paymentMethod, transactionId, paidAt }) => ({
    to: email,
    subject: `Чек об оплате заказа №${orderId} — CleanSpace`,
    text: `Здравствуйте, ${username}! Оплата заказа №${orderId} прошла успешно. Сумма: ${parseFloat(amount).toFixed(2)} Br. Способ оплаты: ${METHOD_LABELS[paymentMethod] || paymentMethod}. ID транзакции: ${transactionId}.`,
    html: wrap(`
      <h2 style="margin:0 0 6px;font-size:20px;">Оплата прошла успешно ✓</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Здравствуйте, <strong>${username}</strong>! Ваш платёж по заказу №${orderId} подтверждён.</p>
      <div style="background:#f0fdfa;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">Сумма оплаты</p>
        <p style="margin:0;font-size:32px;font-weight:700;color:#0d9488;">${parseFloat(amount).toFixed(2)} Br</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>
          ${row('Номер заказа', `№${orderId}`)}
          ${serviceName ? row('Услуга', serviceName) : ''}
          ${address ? row('Адрес', address) : ''}
          ${row('Способ оплаты', METHOD_LABELS[paymentMethod] || paymentMethod)}
          ${row('Дата оплаты', new Date(paidAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}
          <tr><td colspan="2" style="padding:6px 0;border-top:1px solid #e5e7eb;"></td></tr>
          ${row('ID транзакции', `<span style="font-family:monospace;font-size:12px;color:#6b7280;">${transactionId}</span>`)}
        </tbody>
      </table>
      <p style="margin:0;font-size:13px;color:#9ca3af;">Сохраните этот чек для своих записей.</p>
    `),
});

const orderCompletedEmail = ({ email, username, orderId, serviceName, address, completionDate }) => ({
    to: email,
    subject: `Заказ №${orderId} выполнен — CleanSpace`,
    text: `Здравствуйте, ${username}! Ваш заказ №${orderId} (${serviceName || ''}) успешно выполнен ${new Date(completionDate).toLocaleDateString('ru-RU')}. Будем рады вашей оценке!`,
    html: wrap(`
      <h2 style="margin:0 0 6px;font-size:20px;">Заказ №${orderId} выполнен 🎉</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Здравствуйте, <strong>${username}</strong>! Ваш заказ успешно выполнен. Надеемся, результат вас порадовал!</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>
          ${row('Номер заказа', `№${orderId}`)}
          ${row('Услуга', serviceName || '—')}
          ${row('Адрес', address)}
          ${row('Дата выполнения', new Date(completionDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }))}
        </tbody>
      </table>
      <div style="background:#f0fdfa;border-radius:10px;padding:16px 20px;font-size:14px;color:#0f766e;">
        ⭐ Пожалуйста, оцените качество работы в разделе <strong>«Мои заказы»</strong> — ваш отзыв помогает нам становиться лучше.
      </div>
    `),
});

module.exports = {
    welcomeEmail,
    orderConfirmationEmail,
    paymentReceiptEmail,
    orderCompletedEmail,
};
