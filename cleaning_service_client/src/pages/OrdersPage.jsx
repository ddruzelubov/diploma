import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import '../page_styles/OrdersPage.css'; 
import { useNavigate, Link } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setAuthToken(token);

        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Не удалось получить заказы');
            }
        };

        fetchOrders();
    }, [navigate]);

    const completeOrder = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}`, {
                completion_date: new Date()
            });

            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, completion_date: new Date() } : order
            ));
            navigate(`/order-rating/${orderId}`);
        } catch (err) {
            console.error('Error completing order:', err);
            setError('Не удалось обновить заказ');
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            await api.delete(`/orders/${orderId}`);

            setOrders(orders.filter(order => order.id !== orderId));
        } catch (err) {
            console.error('Error canceling order:', err);
            setError('Не удалось отменить заказ');
        }
    };

    return (
        <div className="orders-page">
            <h1>Мои заказы</h1>
            <p className="orders-intro">Отмечайте выполнение и оценивайте результат — так мы держим планку качества.</p>
            {error && <p className="error">{error}</p>}
            {orders.length > 0 ? (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order.id} className="orders-card">
                            <div className="orders-card__main">
                                <strong>{order.service?.name || 'Услуга'}</strong>
                                <span className="orders-card__addr">{order.address}</span>
                            </div>
                            {order.completion_date ? (
                                <span className="orders-card__status orders-card__status--done">
                                    Выполнен {new Date(order.completion_date).toLocaleDateString('ru-RU')}
                                </span>
                            ) : (
                                <div className="orders-card__actions">
                                    <button type="button" className="btn-order btn-order--primary" onClick={() => completeOrder(order.id)}>Заказ выполнен</button>
                                    <button type="button" className="btn-order" onClick={() => cancelOrder(order.id)}>Отменить</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="orders-empty">Пока нет заказов — загляните в <Link to="/services">каталог услуг</Link>.</p>
            )}
        </div>
    );
};

export default OrdersPage;