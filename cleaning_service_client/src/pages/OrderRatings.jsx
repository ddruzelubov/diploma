import React, { useEffect, useState } from 'react';
import api from '../api/api'; 
import '../page_styles/OrderRatings.css'; 

const OrderRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
    const fetchRatings = async () => {
        try {
            const response = await api.get('/ratings');
            console.log(response.data); 
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
            setError('Нет оценок для выполненных заказов.');
        }
    };

    fetchRatings();
}, []);

    return (
        <div className="order-ratings-page">
            <h1>Оценки выполненных заказов</h1>
            {error ? <p className="error">{error}</p>:
            <ul>
            {ratings.map((rating) => (
                <li key={rating.id}>
                    <h2>Услуга:{rating.order.service.name || 'Неизвестная услуга'}</h2>
                    <p>Оценка: {rating.rating}</p>
                    {rating.comment && <p>Комментарий: {rating.comment}</p>}
                    <p>Дата заказа: {new Date(rating.rating_date).toLocaleDateString()}</p>
                </li>
            ))}
        </ul>}
            
        </div>
    );
};

export default OrderRatings;