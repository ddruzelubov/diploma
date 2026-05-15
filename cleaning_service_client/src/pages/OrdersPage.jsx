import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import '../page_styles/OrdersPage.css';
import { useNavigate, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [ratedOrderIds, setRatedOrderIds] = useState(new Set());
    const [paidOrderIds, setPaidOrderIds] = useState(new Set());
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setAuthToken(token);

        const fetchData = async () => {
            try {
                const [ordersRes, ratingsRes, paymentsRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/userRatings').catch(() => ({ data: [] })),
                    api.get('/payments').catch(() => ({ data: [] }))
                ]);
                setOrders(ordersRes.data);
                setRatedOrderIds(new Set(ratingsRes.data.map(r => r.order_id)));
                setPaidOrderIds(new Set(paymentsRes.data.map(p => p.order_id)));
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Не удалось получить заказы');
            }
        };

        fetchData();
    }, [navigate]);

    const cancelOrder = async (orderId) => {
        try {
            await api.delete(`/orders/${orderId}`);
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (err) {
            console.error('Error canceling order:', err);
            setError('Не удалось отменить заказ');
        }
    };

    const completedUnrated = orders.filter(
        o => o.status === 'completed' && !ratedOrderIds.has(o.id)
    );

    const unpaidActive = orders.filter(
        o => o.status !== 'completed' && !paidOrderIds.has(o.id)
    );

    return (
        <div className="orders-page">
            <h1>Мои заказы</h1>
            <p className="orders-intro">Следите за статусом уборок, оплачивайте и оценивайте выполненные заказы.</p>
            {error && <p className="orders-error">{error}</p>}

            {completedUnrated.length > 0 && (
                <div className="orders-notify orders-notify--rate">
                    <span className="orders-notify__icon">⭐</span>
                    <div className="orders-notify__body">
                        <strong>Оцените выполненные заказы</strong>
                        <p>
                            {completedUnrated.length === 1
                                ? 'У вас 1 завершённый заказ без оценки.'
                                : `У вас ${completedUnrated.length} завершённых заказа без оценки.`}
                        </p>
                    </div>
                </div>
            )}

            {unpaidActive.length > 0 && (
                <div className="orders-notify orders-notify--pay">
                    <span className="orders-notify__icon">💳</span>
                    <div className="orders-notify__body">
                        <strong>Есть неоплаченные заказы</strong>
                        <p>
                            {unpaidActive.length === 1
                                ? 'У вас 1 заказ ожидает оплаты.'
                                : `У вас ${unpaidActive.length} заказа ожидают оплаты.`}
                        </p>
                    </div>
                </div>
            )}

            {orders.length > 0 ? (
                <ul className="orders-list">
                    {orders.map(order => {
                        const isDone = order.status === 'completed';
                        const isRated = ratedOrderIds.has(order.id);
                        const isPaid = paidOrderIds.has(order.id);
                        return (
                            <li key={order.id} className={`orders-card${isDone ? ' orders-card--done' : ''}`}>
                                <div className="orders-card__main">
                                    <div className="orders-card__title-row">
                                        <strong>{order.service?.name || 'Услуга'}</strong>
                                        <StatusBadge status={order.status} />
                                        {isPaid && (
                                            <span className="orders-card__paid-badge">💳 Оплачено</span>
                                        )}
                                    </div>
                                    <span className="orders-card__addr">{order.address}</span>
                                    <span className="orders-card__meta">
                                        {new Date(order.order_date).toLocaleDateString('ru-RU')}
                                        {' · '}
                                        {parseFloat(order.total_price).toFixed(2)} ₽
                                    </span>
                                    {order.cleaner && (
                                        <span className="orders-card__cleaner">
                                            Клинер: {order.cleaner.username}
                                        </span>
                                    )}
                                    {isDone && order.completion_date && (
                                        <span className="orders-card__completed">
                                            Выполнен {new Date(order.completion_date).toLocaleDateString('ru-RU')}
                                        </span>
                                    )}
                                </div>
                                <div className="orders-card__actions">
                                    {isDone ? (
                                        isRated ? (
                                            <span className="orders-card__rated">Оценено ✓</span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn-order btn-order--rate"
                                                onClick={() => navigate(`/order-rating/${order.id}`)}
                                            >
                                                Оценить ★
                                            </button>
                                        )
                                    ) : (
                                        <div className="orders-card__action-group">
                                            {!isPaid && (
                                                <button
                                                    type="button"
                                                    className="btn-order btn-order--pay"
                                                    onClick={() => navigate(`/payment/${order.id}`)}
                                                >
                                                    💳 Оплатить
                                                </button>
                                            )}
                                            {order.status === 'pending' && (
                                                <button
                                                    type="button"
                                                    className="btn-order btn-order--cancel"
                                                    onClick={() => cancelOrder(order.id)}
                                                >
                                                    Отменить
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="orders-empty">
                    Пока нет заказов — загляните в <Link to="/services">каталог услуг</Link>.
                </p>
            )}
        </div>
    );
};

export default OrdersPage;
