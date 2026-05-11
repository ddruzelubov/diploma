import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/api';
import '../page_styles/ServiceRatingsPage.css'; 

const ServiceRatingsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {userId, serviceId} = location.state || {}; 
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        const dataToSent = {user_id: userId, service_id: serviceId, rating}
    
        try {
            if(rating === 0){
                setError('Ошибка: рейтинг должен быть минимум "1"');
            return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Ошибка: токен не найден. Пожалуйста, войдите в систему.');
                return;
            }
            setAuthToken(token);

            if(comment.trim()){
                dataToSent.comment = comment;
            }

            const response = await api.post('/reviews', dataToSent);
    
            if (response.status !== 201) { 
                throw new Error('Произошла ошибка при отправке оценки.');
            }

            setRating(0);
            setComment('');
            navigate(`/service-ratings/${serviceId}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="service-ratings-page">
            <h1>Оцените наши услуги</h1>
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

export default ServiceRatingsPage;