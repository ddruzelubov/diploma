import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../page_styles/UserRatingsPage.css'; 

const UserRatingsPage = () => {
    const [orderRatings, setOrderRatings] = useState([]);
    const [serviceRatings, setServiceRatings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setAuthToken(token);

        const fetchRatings = async () => {
            try {
                const orderResponse = await api.get('/userRatings');
                setOrderRatings(orderResponse.data);

                const serviceResponse = await api.get('/reviews');
                setServiceRatings(serviceResponse.data);
            } catch (error) {
                console.error('Error fetching ratings:', error);
                setError('Не удалось получить оценки');
            }
        };

        fetchRatings();
    }, [navigate]);

    const deleteRating = async (ratingId, isOrderRating) => {
        try {
            if (isOrderRating) {
                await api.delete(`/ratings/${ratingId}`);
                setOrderRatings(orderRatings.filter(rating => rating.id !== ratingId));
            } else {
                await api.delete(`/reviews/${ratingId}`);
                setServiceRatings(serviceRatings.filter(rating => rating.id !== ratingId));
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
            setError('Не удалось удалить оценку');
        }
    };

    return (
        <div className="user-ratings-page">
            <h1>Ваши оценки</h1>
            {error && <p className="error">{error}</p>}

            <h2>Оценки заказов</h2>
            {orderRatings.length > 0 ? (
                <ul>
                    {orderRatings.map(rating => (
                        <li key={rating.id}>
                            Заказ ID: {rating.order_id} - Оценка: {rating.rating} 
                            {rating.comment && <span> - Комментарий: {rating.comment}</span>}
                            <span> - Дата: {new Date(rating.rating_date).toLocaleDateString()}</span>
                            <button onClick={() => deleteRating(rating.id, true)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет оценок заказов.</p>
            )}

            <h2>Оценки услуг</h2>
            {serviceRatings.length > 0 ? (
                <ul>
                    {serviceRatings.map(rating => (
                        <li key={rating.id}>
                            Услуга ID: {rating.service_id} - Оценка: {rating.rating} 
                            {rating.comment && <span> - Комментарий: {rating.comment}</span>}
                            <span> - Дата: {new Date(rating.review_date).toLocaleDateString()}</span>
                            <button onClick={() => deleteRating(rating.id, false)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет оценок услуг.</p>
            )}
        </div>
    );
};

export default UserRatingsPage;