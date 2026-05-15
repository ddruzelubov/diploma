import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../page_styles/ServiceRatings.css';

const StarDisplay = ({ rating }) => (
    <div className="stars" aria-label={`Оценка ${rating} из 5`}>
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={`star ${s <= rating ? 'star--filled' : 'star--empty'}`}>★</span>
        ))}
    </div>
);

const ServiceRatings = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/reviews/${serviceId}`)
            .then(r => setReviews(r.data))
            .catch(() => setError('Нет отзывов для этой услуги.'))
            .finally(() => setLoading(false));
    }, [serviceId]);

    const avg = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const dist = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct: reviews.length ? Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100) : 0
    }));

    return (
        <div className="sr-page">
            <button className="sr-back" onClick={() => navigate(-1)}>← Назад к услугам</button>

            <div className="sr-hero">
                <h1>Отзывы об услуге</h1>
                <p className="sr-sub">Оценки клиентов, заказавших эту услугу</p>
            </div>

            {avg && (
                <div className="sr-summary">
                    <div className="sr-summary__score">
                        <span className="sr-summary__num">{avg}</span>
                        <StarDisplay rating={Math.round(avg)} />
                        <span className="sr-summary__count">{reviews.length} отзыв{reviews.length !== 1 ? 'ов' : ''}</span>
                    </div>
                    <div className="sr-summary__bars">
                        {dist.map(d => (
                            <div key={d.star} className="sr-bar-row">
                                <span className="sr-bar-label">{d.star} ★</span>
                                <div className="sr-bar-track">
                                    <div className="sr-bar-fill" style={{ width: `${d.pct}%` }} />
                                </div>
                                <span className="sr-bar-count">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading && <p className="sr-loading">Загрузка…</p>}
            {error && <p className="sr-error">{error}</p>}

            {!loading && !error && reviews.length === 0 && (
                <div className="sr-empty">
                    <span className="sr-empty__icon">💬</span>
                    <p>Пока нет отзывов для этой услуги.</p>
                    <p className="sr-empty__sub">Станьте первым — закажите услугу и оставьте отзыв.</p>
                </div>
            )}

            <div className="sr-list">
                {reviews.map((review, i) => (
                    <article key={review.id} className="sr-card">
                        <div className="sr-card__header">
                            <div className="sr-card__avatar">{String(i + 1).padStart(2, '0')}</div>
                            <div className="sr-card__meta">
                                <StarDisplay rating={review.rating} />
                                <span className="sr-card__date">
                                    {review.review_date
                                        ? new Date(review.review_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : ''}
                                </span>
                            </div>
                            <span className="sr-card__score">{review.rating}/5</span>
                        </div>
                        {review.comment && (
                            <p className="sr-card__comment">"{review.comment}"</p>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
};

export default ServiceRatings;
