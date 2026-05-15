import React, { useState, useEffect } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import '../page_styles/OrderRatingPage.css';

const RATING_LABELS = ['', 'Плохо', 'Не очень', 'Нормально', 'Хорошо', 'Отлично!'];

const OrderRatingPage = () => {
    const { orderId } = useParams();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setAuthToken(token);
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!rating) {
            setError('Пожалуйста, выберите оценку.');
            return;
        }

        setSubmitting(true);
        try {
            const data = { rating };
            if (comment.trim()) data.comment = comment.trim();
            await api.post(`/orders/${orderId}/ratings`, data);
            navigate('/orders');
        } catch {
            setError('Не удалось отправить оценку. Попробуйте ещё раз.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="orp-page">
            <div className="orp-card">
                <button className="orp-back" type="button" onClick={() => navigate('/orders')}>
                    ← Мои заказы
                </button>
                <h1>Оцените заказ</h1>
                <p className="orp-sub">Расскажите, как прошла уборка — это помогает улучшать качество сервиса.</p>

                {error && <p className="orp-error">{error}</p>}

                <form onSubmit={handleSubmit} className="orp-form">
                    <div className="orp-field">
                        <span className="orp-label">Ваша оценка</span>
                        <StarRating value={rating} onChange={setRating} />
                        {rating > 0 && (
                            <span className="orp-rating-text">{RATING_LABELS[rating]}</span>
                        )}
                    </div>

                    <div className="orp-field">
                        <label className="orp-label" htmlFor="orp-comment">
                            Комментарий <span className="orp-optional">(необязательно)</span>
                        </label>
                        <textarea
                            id="orp-comment"
                            className="orp-textarea"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Поделитесь впечатлениями о работе клинера…"
                            rows={4}
                        />
                    </div>

                    <button
                        type="submit"
                        className="orp-submit"
                        disabled={!rating || submitting}
                    >
                        {submitting ? 'Отправка…' : 'Отправить оценку'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderRatingPage;
