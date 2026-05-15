import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../page_styles/AdminOrders.css';
import StatusBadge from '../components/StatusBadge';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [cleaners, setCleaners] = useState([]);
    const [error, setError] = useState('');
    const [assigningOrder, setAssigningOrder] = useState(null);
    const [selectedCleaner, setSelectedCleaner] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setAuthToken(token);

        Promise.all([
            api.get('/orders/all'),
            api.get('/cleaners')
        ]).then(([ordersRes, cleanersRes]) => {
            setOrders(ordersRes.data);
            setCleaners(cleanersRes.data);
        }).catch(() => setError('Не удалось загрузить данные'));
    }, [navigate]);

    const cancelOrder = async (orderId) => {
        try {
            await api.delete(`/orders/${orderId}`);
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch {
            setError('Не удалось отменить заказ');
        }
    };

    const openAssign = (orderId) => {
        setAssigningOrder(orderId);
        setSelectedCleaner('');
    };

    const submitAssign = async (orderId) => {
        if (!selectedCleaner) return;
        try {
            const res = await api.put(`/orders/${orderId}/assign-cleaner`, { cleaner_id: parseInt(selectedCleaner) });
            setOrders(prev => prev.map(o =>
                o.id === orderId
                    ? { ...o, ...res.data, cleaner: cleaners.find(c => c.id === parseInt(selectedCleaner)), status: 'assigned' }
                    : o
            ));
            setAssigningOrder(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Не удалось назначить клинера');
        }
    };

    const pending = orders.filter(o => o.status !== 'completed' && !o.completion_date);
    const completed = orders.filter(o => o.status === 'completed' || o.completion_date);

    return (
        <div className="ao-page">
            <div className="ao-header">
                <h1>Управление заказами</h1>
                <p className="ao-sub">Назначайте клинеров и отслеживайте выполнение уборок.</p>
            </div>

            {error && <p className="ao-error">{error}</p>}

            <section className="ao-section">
                <h2 className="ao-section-title">
                    Активные заказы
                    <span className="ao-count">{pending.length}</span>
                </h2>
                {pending.length === 0 ? (
                    <p className="ao-empty">Нет активных заказов.</p>
                ) : (
                    <div className="ao-list">
                        {pending.map(order => {
                            const isAssigning = assigningOrder === order.id;
                            return (
                                <div key={order.id} className="ao-card">
                                    <div className="ao-card__top">
                                        <div className="ao-card__title-row">
                                            <span className="ao-card__service">{order.service?.name || 'Услуга'}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <span className="ao-card__date">
                                            {new Date(order.order_date).toLocaleDateString('ru-RU')}
                                        </span>
                                    </div>
                                    <div className="ao-card__body">
                                        <div className="ao-row">
                                            <span className="ao-label">📍 Адрес</span>
                                            <span>{order.address}</span>
                                        </div>
                                        <div className="ao-row">
                                            <span className="ao-label">👤 Клиент</span>
                                            <span>{order.user?.username || `ID ${order.user_id}`}</span>
                                        </div>
                                        <div className="ao-row">
                                            <span className="ao-label">📐 Площадь</span>
                                            <span>{order.area} м²</span>
                                        </div>
                                        <div className="ao-row">
                                            <span className="ao-label">💰 Стоимость</span>
                                            <span>{parseFloat(order.total_price).toFixed(2)} ₽</span>
                                        </div>
                                        {order.cleaner && (
                                            <div className="ao-row">
                                                <span className="ao-label">🧹 Клинер</span>
                                                <span className="ao-cleaner-name">{order.cleaner.username}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ao-card__actions">
                                        {isAssigning ? (
                                            <div className="ao-assign-row">
                                                <select
                                                    className="ao-select"
                                                    value={selectedCleaner}
                                                    onChange={e => setSelectedCleaner(e.target.value)}
                                                >
                                                    <option value="">— выберите клинера —</option>
                                                    {cleaners.map(c => (
                                                        <option key={c.id} value={c.id}>{c.username}</option>
                                                    ))}
                                                </select>
                                                <button className="ao-btn ao-btn--primary" onClick={() => submitAssign(order.id)} disabled={!selectedCleaner}>
                                                    Назначить
                                                </button>
                                                <button className="ao-btn" onClick={() => setAssigningOrder(null)}>Отмена</button>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="ao-btn ao-btn--assign" onClick={() => openAssign(order.id)}>
                                                    🧹 {order.cleaner ? 'Сменить клинера' : 'Назначить клинера'}
                                                </button>
                                                <button className="ao-btn ao-btn--danger" onClick={() => cancelOrder(order.id)}>
                                                    Отменить
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="ao-section">
                <h2 className="ao-section-title">
                    Выполненные заказы
                    <span className="ao-count">{completed.length}</span>
                </h2>
                {completed.length === 0 ? (
                    <p className="ao-empty">Нет выполненных заказов.</p>
                ) : (
                    <div className="ao-list">
                        {completed.map(order => (
                            <div key={order.id} className="ao-card ao-card--done">
                                <div className="ao-card__top">
                                    <div className="ao-card__title-row">
                                        <span className="ao-card__service">{order.service?.name || 'Услуга'}</span>
                                        <StatusBadge status="completed" />
                                    </div>
                                    <span className="ao-card__date">
                                        {new Date(order.completion_date).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                                <div className="ao-card__body">
                                    <div className="ao-row">
                                        <span className="ao-label">📍 Адрес</span>
                                        <span>{order.address}</span>
                                    </div>
                                    <div className="ao-row">
                                        <span className="ao-label">👤 Клиент</span>
                                        <span>{order.user?.username || `ID ${order.user_id}`}</span>
                                    </div>
                                    {order.cleaner && (
                                        <div className="ao-row">
                                            <span className="ao-label">🧹 Клинер</span>
                                            <span>{order.cleaner.username}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminOrders;
