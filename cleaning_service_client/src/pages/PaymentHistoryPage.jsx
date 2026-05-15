import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../page_styles/PaymentHistoryPage.css';

const METHOD_LABELS = {
    card: '💳 Банковская карта',
    bank_transfer: '🏦 Банковский перевод',
};

const STATUS_LABELS = {
    paid: { text: 'Оплачено', cls: 'ph-badge--paid' },
    pending: { text: 'В обработке', cls: 'ph-badge--pending' },
    failed: { text: 'Ошибка', cls: 'ph-badge--failed' },
};

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setAuthToken(token);

        api.get('/payments')
            .then(r => setPayments(r.data))
            .catch(() => setError('Не удалось загрузить историю платежей'))
            .finally(() => setLoading(false));
    }, [navigate]);

    const totalPaid = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    if (loading) {
        return (
            <div className="ph-page">
                <p className="ph-loading">Загрузка…</p>
            </div>
        );
    }

    return (
        <div className="ph-page">
            <div className="ph-header">
                <div>
                    <h1>История платежей</h1>
                    <p className="ph-sub">Все ваши транзакции по заказам CleanSpace.</p>
                </div>
                {payments.length > 0 && (
                    <div className="ph-total-card">
                        <span className="ph-total-label">Оплачено всего</span>
                        <span className="ph-total-val">{totalPaid.toFixed(2)} ₽</span>
                    </div>
                )}
            </div>

            {error && <p className="ph-error">{error}</p>}

            {payments.length === 0 ? (
                <div className="ph-empty">
                    <div className="ph-empty__icon">💳</div>
                    <p>У вас пока нет платежей.</p>
                    <button className="ph-cta" onClick={() => navigate('/services')}>
                        Перейти к услугам
                    </button>
                </div>
            ) : (
                <div className="ph-list">
                    {payments.map(payment => {
                        const st = STATUS_LABELS[payment.status] || STATUS_LABELS.paid;
                        return (
                            <div key={payment.id} className="ph-card">
                                <div className="ph-card__left">
                                    <div className="ph-card__icon">💳</div>
                                    <div className="ph-card__info">
                                        <span className="ph-card__service">
                                            {payment.order?.service?.name || `Заказ №${payment.order_id}`}
                                        </span>
                                        <span className="ph-card__method">
                                            {METHOD_LABELS[payment.payment_method] || payment.payment_method}
                                        </span>
                                        <span className="ph-card__date">
                                            {new Date(payment.created_at).toLocaleDateString('ru-RU', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="ph-card__right">
                                    <span className="ph-card__amount">
                                        {parseFloat(payment.amount).toFixed(2)} ₽
                                    </span>
                                    <span className={`ph-badge ${st.cls}`}>{st.text}</span>
                                    {payment.transaction_id && (
                                        <span className="ph-card__txid" title={payment.transaction_id}>
                                            #{payment.transaction_id.slice(0, 8)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PaymentHistoryPage;
