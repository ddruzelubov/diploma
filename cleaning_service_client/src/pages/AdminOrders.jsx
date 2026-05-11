import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import '../page_styles/OrdersPage.css'; 
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
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
                const response = await api.get('/orders/all');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
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
        } catch (error) {
            console.error('Error completing order:', error);
            setError('Не удалось обновить заказ');
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            await api.delete(`/orders/${orderId}`);

            setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error canceling order:', error);
            setError('Не удалось отменить заказ');
        }
    };

    return (
        <div className="orders-page">
            <h1>Список заказов</h1>
            {error && <p className="error">{error}</p>}
            {orders.length > 0 ? (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            {order.service.name} - {order.address} 
                            {order.completion_date ? (
                                <span>
                                    {' '} - Выполнен {new Date(order.completion_date).toLocaleDateString()}
                                </span>
                            ) : (
                                <>
                                    <button type="button" onClick={() => completeOrder(order.id)}>Заказ выполнен</button>
                                    <button type="button" onClick={() => cancelOrder(order.id)}>Отменить заказ</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет заказов.</p>
            )}
        </div>
    );
};

export default AdminOrders;