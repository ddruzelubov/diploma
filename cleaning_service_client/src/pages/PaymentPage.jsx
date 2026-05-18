import React, { useState, useEffect } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import '../page_styles/PaymentPage.css';

const formatCardNumber = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const [method, setMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [holder, setHolder] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setAuthToken(token);

        api.get(`/orders/${orderId}`)
            .then(r => setOrder(r.data))
            .catch(() => setError('Заказ не найден'))
            .finally(() => setLoading(false));
    }, [orderId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);
        try {
            await api.post('/payments', {
                order_id: parseInt(orderId),
                payment_method: method
            });
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при оплате');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="pay-page">
                <div className="pay-card pay-card--loading">
                    <p>Загрузка заказа…</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="pay-page">
                <div className="pay-card">
                    <p className="pay-error">{error || 'Заказ не найден'}</p>
                    <button className="pay-back" onClick={() => navigate('/orders')}>← Назад к заказам</button>
                </div>
            </div>
        );
    }

    return (
        <div className="pay-page">
            <div className="pay-card">
                <button className="pay-back-link" type="button" onClick={() => navigate('/orders')}>
                    ← Мои заказы
                </button>

                <h1>Оплата заказа</h1>

                <div className="pay-summary">
                    <div className="pay-summary__row">
                        <span className="pay-summary__label">Услуга</span>
                        <span className="pay-summary__val">{order.service?.name || '—'}</span>
                    </div>
                    <div className="pay-summary__row">
                        <span className="pay-summary__label">Адрес</span>
                        <span className="pay-summary__val">{order.address}</span>
                    </div>
                    <div className="pay-summary__row">
                        <span className="pay-summary__label">Площадь</span>
                        <span className="pay-summary__val">{order.area} м²</span>
                    </div>
                    <div className="pay-summary__row pay-summary__row--total">
                        <span className="pay-summary__label">К оплате</span>
                        <span className="pay-summary__total">{parseFloat(order.total_price).toFixed(2)} Br</span>
                    </div>
                </div>

                {error && <p className="pay-error">{error}</p>}

                <div className="pay-method-tabs">
                    <button
                        type="button"
                        className={`pay-tab${method === 'card' ? ' pay-tab--active' : ''}`}
                        onClick={() => setMethod('card')}
                    >
                        💳 Банковская карта
                    </button>
                    <button
                        type="button"
                        className={`pay-tab${method === 'bank_transfer' ? ' pay-tab--active' : ''}`}
                        onClick={() => setMethod('bank_transfer')}
                    >
                        🏦 Банковский перевод
                    </button>
                </div>

                <form className="pay-form" onSubmit={handleSubmit}>
                    {method === 'card' ? (
                        <>
                            <label className="pay-field">
                                <span>Номер карты</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                    required
                                    autoComplete="cc-number"
                                />
                            </label>
                            <div className="pay-row">
                                <label className="pay-field">
                                    <span>Срок действия</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="ММ/ГГ"
                                        value={expiry}
                                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                                        required
                                        autoComplete="cc-exp"
                                    />
                                </label>
                                <label className="pay-field">
                                    <span>CVV</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="•••"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        required
                                        autoComplete="cc-csc"
                                    />
                                </label>
                            </div>
                            <label className="pay-field">
                                <span>Имя держателя карты</span>
                                <input
                                    type="text"
                                    placeholder="IVAN PETROV"
                                    value={holder}
                                    onChange={e => setHolder(e.target.value.toUpperCase())}
                                    required
                                    autoComplete="cc-name"
                                />
                            </label>
                        </>
                    ) : (
                        <div className="pay-bank-info">
                            <p className="pay-bank-info__title">Реквизиты для перевода</p>
                            <div className="pay-bank-info__row">
                                <span>Получатель</span>
                                <strong>ООО «CleanSpace»</strong>
                            </div>
                            <div className="pay-bank-info__row">
                                <span>УНП</span>
                                <strong>101234567</strong>
                            </div>
                            <div className="pay-bank-info__row">
                                <span>Р/счёт</span>
                                <strong>BY20AKBB30120000001234000000</strong>
                            </div>
                            <div className="pay-bank-info__row">
                                <span>Банк</span>
                                <strong>Беларусбанк</strong>
                            </div>
                            <div className="pay-bank-info__row">
                                <span>Назначение платежа</span>
                                <strong>Заказ №{orderId}</strong>
                            </div>
                            <p className="pay-bank-info__note">
                                После перевода нажмите кнопку ниже для подтверждения оплаты.
                            </p>
                        </div>
                    )}

                    <button type="submit" className="pay-submit" disabled={processing}>
                        {processing
                            ? 'Обработка…'
                            : `Оплатить ${parseFloat(order.total_price).toFixed(2)} Br`}
                    </button>
                </form>

                <p className="pay-secure">🔒 Безопасная передача данных</p>
            </div>
        </div>
    );
};

export default PaymentPage;
