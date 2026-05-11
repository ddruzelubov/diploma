import React, { useState, useEffect } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import '../page_styles/OrderRatingPage.css'; 

const OrderRatingPage = () => {
    const { orderId } = useParams();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setAuthToken(token);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const dataToSent = {rating}

        if(!orderId || !rating){
            setError("Неверные данные");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Ошибка: токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        if(comment.trim()){
            dataToSent.comment = comment;
        }

        try {
            setAuthToken(token);
            await api.post(`/orders/${orderId}/ratings`, dataToSent);

            navigate('/orders'); 
        } catch (error) {
            console.error('Ошибка при отправке оценки:', error);
            setError('Не удалось отправить оценку');
        }
    };

    return (
        <div className="order-rating-page">
            <h1>Оцените заказ</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Оценка:
                    <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        min="1"
                        max="5"
                        required
                    />
                </label>
                <br />
                <label>
                    Комментарий:
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Отправить оценку</button>
            </form>
        </div>
    );
};

export default OrderRatingPage;