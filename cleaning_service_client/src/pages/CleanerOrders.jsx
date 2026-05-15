import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../page_styles/CleanerOrders.css';

const statusLabel = {
    pending: { text: 'Ожидает', cls: 'badge--pending' },
    assigned: { text: 'Назначен', cls: 'badge--assigned' },
    in_progress: { text: 'В работе', cls: 'badge--progress' },
    completed: { text: 'Выполнен', cls: 'badge--done' },
};

const CleanerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setAuthToken(token);

        api.get('/cleaner/orders')
            .then(r => setOrders(r.data))
            .catch(() => setError('Не удалось загрузить задания.'))
            .finally(() => setLoading(false));
    }, [navigate]);

    const updateStatus = async (orderId, status) => {
        try {
            const body = { status };
            if (status === 'completed') body.completion_date = new Date();
            await api.put(`/orders/${orderId}`, body);
            setOrders(prev => prev.map(o =>
                o.id === orderId
                    ? { ...o, status, completion_date: status === 'completed' ? new Date() : o.completion_date }
                    : o
            ));
        } catch {
            setError('Не удалось обновить статус.');
        }
    };

    if (loading) return <div className="cleaner-orders"><p className="co-loading">Загрузка…</p></div>;

    return (
        <div className="cleaner-orders">
            <div className="co-header">
                <h1>Мои задания</h1>
                <p className="co-sub">Здесь отображаются заказы, назначенные вам администратором.</p>
            </div>

            {error && <p className="co-error">{error}</p>}

            {orders.length === 0 ? (
                <div className="co-empty">
                    <div className="co-empty__icon">🧹</div>
                    <p>Пока нет назначенных заданий.</p>
                    <p className="co-empty__sub">Обратитесь к администратору для получения заданий.</p>
                </div>
            ) : (
                <div className="co-list">
                    {orders.map(order => {
                        const st = statusLabel[order.status] || { text: order.status, cls: 'badge--pending' };
                        const isDone = order.status === 'completed';
                        return (
                            <div key={order.id} className={`co-card ${isDone ? 'co-card--done' : ''}`}>
                                <div className="co-card__top">
                                    <div className="co-card__info">
                                        <span className="co-card__service">{order.service?.name || 'Услуга'}</span>
                                        <span className={`co-badge ${st.cls}`}>{st.text}</span>
                                    </div>
                                    {order.completion_date && (
                                        <span className="co-card__date">
                                            Выполнен {new Date(order.completion_date).toLocaleDateString('ru-RU')}
                                        </span>
                                    )}
                                </div>

                                <div className="co-card__body">
                                    <div className="co-card__row">
                                        <span className="co-card__label">📍 Адрес</span>
                                        <span>{order.address}</span>
                                    </div>
                                    <div className="co-card__row">
                                        <span className="co-card__label">📐 Площадь</span>
                                        <span>{order.area} м²</span>
                                    </div>
                                    <div className="co-card__row">
                                        <span className="co-card__label">💰 Стоимость</span>
                                        <span>{parseFloat(order.total_price).toFixed(2)} ₽</span>
                                    </div>
                                    <div className="co-card__row">
                                        <span className="co-card__label">📅 Заказ от</span>
                                        <span>{new Date(order.order_date).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                    {order.user && (
                                        <div className="co-card__row">
                                            <span className="co-card__label">👤 Клиент</span>
                                            <span>{order.user.username}</span>
                                        </div>
                                    )}
                                </div>

                                {!isDone && (
                                    <div className="co-card__actions">
                                        {order.status === 'assigned' && (
                                            <button
                                                className="co-btn co-btn--secondary"
                                                onClick={() => updateStatus(order.id, 'in_progress')}
                                            >
                                                Начать уборку
                                            </button>
                                        )}
                                        {(order.status === 'assigned' || order.status === 'in_progress') && (
                                            <button
                                                className="co-btn co-btn--primary"
                                                onClick={() => updateStatus(order.id, 'completed')}
                                            >
                                                Завершить
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CleanerOrders;
